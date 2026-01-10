// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol"; //Standard per NFT
import "@openzeppelin/contracts/access/Ownable.sol"; //Limita funzioni a owner
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol"; //Rende revocabile

contract EnteNFT is ERC721, ERC721Burnable, Ownable {
    uint256 private _nextTokenId;

    mapping(address => uint256) public addressToTokenId;
    mapping(address => bool) public hasNFT;

    // Al momento deploy
    constructor() ERC721("Ente autorizzato Chain4Good", "ETS") Ownable(msg.sender) {}

    // Crea NFT -> Solo l'admin può rilasciarlo
    function safeMint(address to) public onlyOwner {
        require(!hasNFT[to], "L'utente ha gia' un NFT Ente");

        uint256 tokenId = _nextTokenId++;
        addressToTokenId[to] = tokenId;
        hasNFT[to] = true;

        _safeMint(to, tokenId);
    }

    // Rendiamo l'NFT Soulbound: blocchiamo i trasferimenti tra utenti
    // Eseguita prima di ogni trasferimento automaticamente
    function _update(address to, uint256 tokenId, address auth) internal override(ERC721) returns (address) {
        address from = _ownerOf(tokenId);
        // Permettiamo solo il "minting" (creazione da indirizzo 0) o il "burning" (distruzione: invio a indirizzo 0)
        if (from != address(0) && to != address(0)) {
            revert("Questo NFT e' Soulbound e non puo' essere trasferito");
        }
        return super._update(to, tokenId, auth);
    }

    // Revoca l'NFT di un ente
    function revokeEnte(address account) public onlyOwner {
        require(hasNFT[account], "L'account non ha un NFT da revocare");
        
        uint256 tokenId = addressToTokenId[account];
        _burn(tokenId); 
        
        delete addressToTokenId[account];
        hasNFT[account] = false;
    }
}