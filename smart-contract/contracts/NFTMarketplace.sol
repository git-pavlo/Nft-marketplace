// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;

    struct Listing {
        uint256 tokenId;
        address seller;
        uint256 price;
    }

    mapping(uint256 => Listing) public listings;

    event NFTMinted(uint256 tokenId, address owner, string tokenURI);
    event NFTListed(uint256 tokenId, uint256 price);
    event NFTSold(uint256 tokenId, address buyer, uint256 price);
    event NFTTransferred(uint256 tokenId, address from, address to);

    constructor() ERC721("MyNFT", "MNFT") {
        tokenCounter = 0;
    }

    // -----------------------
    // Mint NFT (owner only) with tokenURI
    // -----------------------
    function mint(address to, string memory tokenURI) external  {
        tokenCounter += 1;
        uint256 newTokenId = tokenCounter;
        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI); // store IPFS URI
        emit NFTMinted(newTokenId, to, tokenURI);
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
    // Send NFT to someone
    // -----------------------
    function sendNFT(address to, uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        _transfer(msg.sender, to, tokenId);
        emit NFTTransferred(tokenId, msg.sender, to);
    }

    // -----------------------
    // Delist NFT from sale
    // -----------------------
    function delistNFT(uint256 tokenId) external {
        Listing memory listed = listings[tokenId];
        require(listed.price > 0, "NFT not listed");
        require(listed.seller == msg.sender, "Not seller");

        delete listings[tokenId];
        emit NFTListed(tokenId, 0); // price 0 means delisted
    }

    // -----------------------
    // Get all NFTs owned by a user
    // -----------------------
    function getMyNFTs(address user) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(user);
        uint256[] memory tokens = new uint256[](balance);
        uint256 count = 0;

        for (uint256 i = 1; i <= tokenCounter; i++) {
            if (_exists(i) && ownerOf(i) == user) {
                tokens[count] = i;
                count++;
            }
        }

        return tokens;
    }

    // -----------------------
    // Get all NFTs listed for sale by a user
    // -----------------------
    function getMyListings(address user) external view returns (Listing[] memory) {
        uint256 total = tokenCounter;
        uint256 count = 0;

        for (uint256 i = 1; i <= total; i++) {
            if (listings[i].seller == user) {
                count++;
            }
        }

        Listing[] memory userListings = new Listing[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= total; i++) {
            if (listings[i].seller == user) {
                userListings[index] = listings[i];
                index++;
            }
        }

        return userListings;
    }

    // -----------------------
    // Get tokenURI of an NFT
    // -----------------------
    function getTokenURI(uint256 tokenId) external view returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return tokenURI(tokenId);
    }

    function getListing(uint256 tokenId) external view returns (Listing memory) {
        return listings[tokenId];
    }
}
