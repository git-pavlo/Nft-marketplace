// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;

    struct NFTItem {
        uint256 tokenId;
        address payable seller;
        uint256 price;
        bool forSale;
    }

    mapping(uint256 => NFTItem) public nftItems;

    event NFTMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string tokenURI
    );
    event NFTListed(uint256 indexed tokenId, uint256 price, address indexed seller);
    event NFTSold(uint256 indexed tokenId, uint256 price, address indexed buyer);
    event NFTSaleCancelled(uint256 indexed tokenId, address indexed seller);

    constructor() ERC721("FriendNFT", "FRND") Ownable(msg.sender) {}

    /* ---------------------------------------------------------- */
    /*                           MINT                             */
    /* ---------------------------------------------------------- */

    function mintNFT(string memory tokenURI) external returns (uint256) {
        _tokenIds++;
        uint256 tokenId = _tokenIds;

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);

        emit NFTMinted(tokenId, msg.sender, tokenURI);
        return tokenId;
    }

    /* ---------------------------------------------------------- */
    /*                           LIST                             */
    /* ---------------------------------------------------------- */

    function listNFT(uint256 tokenId, uint256 price) external {
        require(ownerOf(tokenId) == msg.sender, "Not NFT owner");
        require(price > 0, "Price must be > 0");

        nftItems[tokenId] = NFTItem({
            tokenId: tokenId,
            seller: payable(msg.sender),
            price: price,
            forSale: true
        });

        emit NFTListed(tokenId, price, msg.sender);
    }

    function cancelSale(uint256 tokenId) external {
        NFTItem storage item = nftItems[tokenId];

        require(item.forSale, "NFT not for sale");
        require(item.seller == msg.sender, "Not seller");

        item.forSale = false;
        emit NFTSaleCancelled(tokenId, msg.sender);
    }

    /* ---------------------------------------------------------- */
    /*                           BUY                              */
    /* ---------------------------------------------------------- */

    function buyNFT(uint256 tokenId) external payable {
        NFTItem storage item = nftItems[tokenId];

        require(item.forSale, "NFT not for sale");
        require(msg.value == item.price, "Incorrect ETH sent");

        item.forSale = false;

        _transfer(item.seller, msg.sender, tokenId);
        item.seller.transfer(msg.value);

        emit NFTSold(tokenId, msg.value, msg.sender);
    }

    /* ---------------------------------------------------------- */
    /*                           VIEW                             */
    /* ---------------------------------------------------------- */

    function getNFT(uint256 tokenId) external view returns (NFTItem memory) {
        return nftItems[tokenId];
    }

    function totalSupply() external view returns (uint256) {
        return _tokenIds;
    }
} 
