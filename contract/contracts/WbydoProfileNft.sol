// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WbydoProfileNft is ERC721Enumerable, Ownable {
    string private _BASE_URI;

    constructor(string memory __baseURI)
        ERC721("wbydo Profile Token", "wbydo")
        Ownable()
    {
        _BASE_URI = __baseURI;
    }

    function _baseURI() internal view override(ERC721) returns (string memory) {
        return _BASE_URI;
    }

    function mint(uint256 tokenId) public onlyOwner {
        _safeMint(_msgSender(), tokenId);
    }
}
