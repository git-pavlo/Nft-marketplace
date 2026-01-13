// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;

    // Mapping tokenId => price (0 if not listed)
    mapping(uint256 => uint256) public listings;

    constructor() ERC721("MyNFT", "MNFT") {
        tokenCounter = 0;
    }

    // ===========================
    // Mint NFT (Owner Only)
    // ===========================
    function mintNFT(string memory tokenURI) public onlyOwner returns (uint256) {
        tokenCounter++;
        uint256 newTokenId = tokenCounter;
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        return newTokenId;
    }

    // ===========================
    // Sell NFT
    // ===========================
    function sellNFT(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        require(price > 0, "Price must be > 0");
        listings[tokenId] = price;
    }

    // ===========================
    // Delist NFT
    // ===========================
    function delistNFT(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        listings[tokenId] = 0;
    }

    // ===========================
    // Buy NFT
    // ===========================
    function buyNFT(uint256 tokenId) public payable {
        uint256 price = listings[tokenId];
        address seller = ownerOf(tokenId);

        require(price > 0, "Not for sale");
        require(msg.value >= price, "Insufficient funds");
        require(msg.sender != seller, "Cannot buy your own NFT");

        // Transfer NFT
        _transfer(seller, msg.sender, tokenId);

        // Pay seller
        (bool success, ) = payable(seller).call{value: msg.value}("");
        require(success, "ETH transfer failed");

        // Remove listing
        listings[tokenId] = 0;
    }

    // ===========================
    // Send NFT to another address
    // ===========================
    function sendNFT(uint256 tokenId, address to) public {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        _transfer(msg.sender, to, tokenId);
        listings[tokenId] = 0; // auto delist if sending
    }

    // ===========================
    // Get all my NFTs
    // ===========================
    function getMyNFTs(address user) public view returns (uint256[] memory) {
        uint256 total = tokenCounter;
        uint256 count = 0;

        for (uint256 i = 1; i <= total; i++) {
            if (ownerOf(i) == user) {
                count++;
            }
        }

        uint256[] memory result = new uint256[](count);
        uint256 index = 0;

        for (uint256 i = 1; i <= total; i++) {
            if (ownerOf(i) == user) {
                result[index] = i;
                index++;
            }
        }

        return result;
    }
}
