// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    uint256 public tokenCount;

    event Minted(
        address indexed owner,
        uint256 indexed tokenId,
        string tokenURI
    );

    constructor() ERC721("MyNFT", "MNFT") {}

    function mint(string memory _uri) external returns (uint256) {
        tokenCount++;

        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _uri);

        emit Minted(msg.sender, tokenCount, _uri);

        return tokenCount;
    }
}
