// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFTMarketplace is ReentrancyGuard {

    struct Listing {
        address seller;
        uint256 price; // in wei
    }

    // nft contract => tokenId => listing
    mapping(address => mapping(uint256 => Listing)) private listings;

    // seller address => proceeds amount
    mapping(address => uint256) private proceeds;

    /* ========== EVENTS ========== */

    event ItemListed(address indexed nftAddress, uint256 indexed tokenId, address indexed seller, uint256 price);
    event ItemCanceled(address indexed nftAddress, uint256 indexed tokenId, address indexed seller);
    event ItemBought(address indexed nftAddress, uint256 indexed tokenId, address indexed buyer, uint256 price);

    /* ========== MODIFIERS ========== */

    modifier notListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = listings[nftAddress][tokenId];
        require(listing.price == 0, "Already listed");
        _;
    }

    modifier isListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = listings[nftAddress][tokenId];
        require(listing.price > 0, "Not listed");
        _;
    }

    modifier isOwner(address nftAddress, uint256 tokenId, address spender) {
        IERC721 nft = IERC721(nftAddress);
        require(nft.ownerOf(tokenId) == spender, "Not owner");
        _;
    }

    /* ========== MAIN FUNCTIONS ========== */

    /// @notice List an NFT on the marketplace
    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    )
        external
        notListed(nftAddress, tokenId)
        isOwner(nftAddress, tokenId, msg.sender)
    {
        require(price > 0, "Price must be > 0");
        listings[nftAddress][tokenId] = Listing(msg.sender, price);
        emit ItemListed(nftAddress, tokenId, msg.sender, price);
    }

    /// @notice Cancel a listing
    function cancelListing(address nftAddress, uint256 tokenId)
        external
        isListed(nftAddress, tokenId)
        isOwner(nftAddress, tokenId, msg.sender)
    {
        delete listings[nftAddress][tokenId];
        emit ItemCanceled(nftAddress, tokenId, msg.sender);
    }

    /// @notice Buy a listed NFT
    function buyItem(address nftAddress, uint256 tokenId)
        external
        payable
        nonReentrant
        isListed(nftAddress, tokenId)
    {
        Listing memory listedItem = listings[nftAddress][tokenId];
        require(msg.value == listedItem.price, "Price not met");

        // record seller proceeds
        proceeds[listedItem.seller] += msg.value;

        // remove listing before transfer to avoid reentrancy issues
        delete listings[nftAddress][tokenId];

        // transfer NFT
        IERC721(nftAddress).safeTransferFrom(listedItem.seller, msg.sender, tokenId);

        emit ItemBought(nftAddress, tokenId, msg.sender, listedItem.price);
    }

    /// @notice Withdraw proceeds from sales
    function withdrawProceeds() external nonReentrant {
        uint256 amount = proceeds[msg.sender];
        require(amount > 0, "No proceeds");

        proceeds[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
    }

    /* ========== VIEW FUNCTIONS ========== */

    function getListing(address nftAddress, uint256 tokenId)
        external
        view
        returns (Listing memory)
    {
        return listings[nftAddress][tokenId];
    }

    function getProceeds(address seller) external view returns (uint256) {
        return proceeds[seller];
    }
}
