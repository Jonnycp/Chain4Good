// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        // Minta 1 milione di token a chi fa il deploy per poterli distribuire
        _mint(msg.sender, 1000000 * 10**18);
    }

    // Mintare token a chiunque (per i test)
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}