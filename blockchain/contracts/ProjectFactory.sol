// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./ProjectVault.sol";

interface IEnteNFT {
    function hasNFT(address _account) external view returns (bool);
}

contract ProjectFactory {
    address[] public deployedProjects; //address dei progetti (getter solo singolo)
    address public nftContract;
    
    event ProjectCreated(address projectAddress, address owner, uint256 target);

    constructor(address _nftContract) {
        nftContract = _nftContract;
    }

    function createProject(
        address _token,
        uint256 _target,
        uint256 _deadline
    ) external {
        require(IEnteNFT(nftContract).hasNFT(msg.sender), "Devi essere un Ente certificato per creare progetti");

        // Creiamo un nuovo Vault
        ProjectVault newProject = new ProjectVault(
            msg.sender, // L'Ente diventa il proprietario del Vault (solo amministrativamente, soldi spostati con funzioni)
            _token,
            _target,
            _deadline
        );

        deployedProjects.push(address(newProject));

        emit ProjectCreated(address(newProject), msg.sender, _target);
    }

    function getProjects() external view returns (address[] memory) { //external view (non modifica stato e può essere chiamata dall'esterno)
        return deployedProjects;
    }
}