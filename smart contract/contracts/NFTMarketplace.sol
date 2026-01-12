// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is ERC721, Ownable {
    uint256 public tokenCounter;

    struct Listing {
        uint256 tokenId;
        address seller;
        uint256 price;
    }

    mapping(uint256 => Listing) public listings;

    event NFTMinted(uint256 tokenId, address owner);
    event NFTListed(uint256 tokenId, uint256 price);
    event NFTSold(uint256 tokenId, address buyer, uint256 price);
    event NFTTransferred(uint256 tokenId, address from, address to);

    constructor() ERC721("MyNFT", "MNFT") {
        tokenCounter = 0;
    }

    // -----------------------
    // Mint NFT (owner only)
    // -----------------------
    function mint(address to) external onlyOwner {
        tokenCounter += 1;
        uint256 newTokenId = tokenCounter;
        _safeMint(to, newTokenId);
        emit NFTMinted(newTokenId, to);
    }

    // -----------------------
    // List NFT for sale
    // -----------------------
    function listNFT(uint256 tokenId, uint256 price) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        require(price > 0, "Price must be > 0");

        listings[tokenId] = Listing(tokenId, msg.sender, price);
        emit NFTListed(tokenId, price);
    }

    // -----------------------
    // Buy NFT
    // -----------------------
    function buyNFT(uint256 tokenId) external payable {
        Listing memory listed = listings[tokenId];
        require(listed.price > 0, "NFT not for sale");
        require(msg.value >= listed.price, "Not enough ETH");

        // Transfer NFT
        _transfer(listed.seller, msg.sender, tokenId);

        // Pay seller
        (bool success, ) = listed.seller.call{value: listed.price}("");
        require(success, "Payment failed");

        // Remove listing
        delete listings[tokenId];

        emit NFTSold(tokenId, msg.sender, listed.price);
    }

    // -----------------------
    // Transfer NFT (send to someone)
    // -----------------------
    function sendNFT(address to, uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        _transfer(msg.sender, to, tokenId);
        emit NFTTransferred(tokenId, msg.sender, to);
    }

    // -----------------------
    // View listing
    // -----------------------
    function getListing(uint256 tokenId) external view returns (Listing memory) {
        return listings[tokenId];
    }
}
