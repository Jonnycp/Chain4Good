// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol"; //Interfaccia standard ERC20 per stablecoin
import "@openzeppelin/contracts/access/Ownable.sol"; //Limita funzioni a owner

contract ProjectVault is Ownable {
    IERC20 public token;          // La stablecoin scelta (EURC o USDC)
    uint256 public targetAmount;  // Obiettivo in token (es. 20000)
    uint256 public deadline;      // Data fine raccolta
    uint256 public totalCollected;// Somma totale ricevuta
    uint256 public totalSpent;    // Somma totale spesa
    bool public isRequestInProgress; // Se c'è una richiesta di spesa in corso
    uint256 public totalDonors; //Donatori totali

    struct SpendingRequest {
        uint256 amount;
        uint256 votesFor;
        uint256 votesAgainst;
        bool executed;
        bytes32 proofHash;
        uint256 endTime;
    }

    SpendingRequest[] public requests;
    mapping(address => bool) public isDonor; // Se ha donato
    mapping(uint256 => mapping(address => bool)) public hasVoted; // Se un utente ha votato una specifica richiesta

    // Eventi per il Backend (per sincronizzare il DB)
    event Donated(address indexed donor, uint256 amount);
    event RequestCreated(uint256 requestId, uint256 amount);
    event RequestExecuted(uint256 requestId);
    event RequestRejected(uint256 requestId);
    event VaultUnlocked(uint256 requestId);
    
    constructor(
        address _owner,
        address _token,
        uint256 _target,
        uint256 _deadline
    ) Ownable(_owner) {
        token = IERC20(_token);
        targetAmount = _target;
        deadline = _deadline;

        totalCollected = 0;
        totalSpent = 0;
        isRequestInProgress = false;
        totalDonors = 0;
    }

    // Funzione per donare: l'utente deve aver fatto "approve" sul token prima
    function donate(uint256 _amount) external {
        require(msg.sender != owner(), "L'Ente non puo' donare al proprio progetto");
        require(block.timestamp < deadline, "Raccolta fondi terminata"); //Richiedi condizione, se falsa => errore
        require(totalCollected < targetAmount, "Obiettivo di raccolta gia' raggiunto");
        require(totalCollected + _amount <= targetAmount, "Donazione eccede l'obiettivo");
        require(token.transferFrom(msg.sender, address(this), _amount), "Trasferimento fallito");

        if (!isDonor[msg.sender]) {
            isDonor[msg.sender] = true;
            totalDonors++;
        }
        totalCollected += _amount;

        emit Donated(msg.sender, _amount);
    }

    // L'Ente crea una richiesta di spesa
    function createRequest(uint256 _amount) external onlyOwner {
        require(!isRequestInProgress, "Esiste gia' una spesa approvata, non ancora confermata con fattura");
        require(totalCollected >= targetAmount || block.timestamp >= deadline, "Progetto non ancora attivo");
        require(_amount <= token.balanceOf(address(this)), "Fondi insufficienti nel vault");
        //token.balanceOf(address(this)) restituisce il saldo del contratto

        requests.push(SpendingRequest({
            amount: _amount,
            votesFor: 0,
            votesAgainst: 0,
            executed: false,
            proofHash: bytes32(0),
            endTime: block.timestamp + 3 days // La votazione dura 3 giorni
        }));

        isRequestInProgress = true;
        emit RequestCreated(requests.length - 1, _amount);
    }

    // I donatori votano la richiesta di spesa. Ogni donatore ha lo stesso peso
    function vote(uint256 _requestId, bool _support) external {
        require(isDonor[msg.sender], "Solo i donatori possono votare");
        require(!hasVoted[_requestId][msg.sender], "Hai gia' votato");
        
        SpendingRequest storage request = requests[_requestId]; //storage = dati persistenti
        require(!request.executed, "Spesa gia eseguita");
        require(block.timestamp < request.endTime, "Votazione terminata");
        
        if (_support) request.votesFor += 1; //VOTO equo
        else request.votesAgainst += 1;

        hasVoted[_requestId][msg.sender] = true;
    }

    // Se la maggioranza ha votato SI, i soldi vengono sbloccati
    function executeRequest(uint256 _requestId) external onlyOwner {
        SpendingRequest storage request = requests[_requestId];
        require(!request.executed, "Gia' eseguita");

        // Verifica se si può procedere:
        // 1. Tempo scaduto E voti favorevoli >= contrari
        // 2. Oppure: Voti favorevoli > donatori totali - votiAttuali
        // ma voti > 0

        bool timeEnded = block.timestamp >= request.endTime;
        bool mathMajority = request.votesFor >= totalDonors - (request.votesFor + request.votesAgainst);
        bool simpleMajority = request.votesFor >= request.votesAgainst;

        // Se il tempo non è scaduto e non c'è maggioranza matematica, allora è ancora in corso
        if (!timeEnded && !mathMajority) {
            revert("Votazione ancora in corso e maggioranza matematica non raggiunta");
        }

        // Se il tempo è scaduto ma i NO superano i SI
        if (timeEnded && !simpleMajority) {
            isRequestInProgress = false;
            emit RequestRejected(_requestId);
            return;
        }

        require(token.transfer(owner(), request.amount), "Trasferimento fallito");
        request.executed = true;
        totalSpent += request.amount;
        emit RequestExecuted(_requestId);
    }

    // Conferma del caricamento della fattura sbloccando il vault
    //TODO: Wallet admin
    function finalizeRequest(uint256 _requestId, bytes32 _proofHash) external onlyOwner {
        SpendingRequest storage request = requests[_requestId];
        require(request.executed, "Spesa non ancora eseguita");
        require(_proofHash != bytes32(0), "Hash fattura non valido");
        
        request.proofHash = _proofHash;
        isRequestInProgress = false;

        emit VaultUnlocked(_requestId);
    }
}