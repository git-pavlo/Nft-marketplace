// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is Ownable {
    constructor() {
        // owner is automatically msg.sender
    }
}
