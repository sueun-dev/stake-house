// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "https://github.com/sueun-dev/ERC721A_GOMZ/blob/main/contracts/ERC721A.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract GomzV1 is ERC721A, Ownable, ReentrancyGuard {

    struct TokenInfo {
        IERC20 paytoken;
        uint256 costvalue;
    }

    TokenInfo[] public AllowedCrypto;

    uint256 MAX_MINTS = 5;
    uint256 public MAX_SUPPLY = 1000;
    uint256 public PRICE_PER_ETH = 0.001 ether;
    uint256 public WL_PRICE_PER_ETH = 0.0001 ether;

    mapping(address => bool) public whitelisted;
    uint256 public numWhitelisted;
    uint16 WL_MAX_SUPPLY = 300;

    string private _baseTokenURI;

    uint256 public constant maxPurchase = 3;

    constructor(string memory baseTokenURI) ERC721A("StakeHouse_NFT", "SH_NFT") Ownable(msg.sender) {
        _baseTokenURI = baseTokenURI;
    }
    
     function addCurrency(
        IERC20 _paytoken,
        uint256 _costvalue
    ) public onlyOwner {
        
        AllowedCrypto.push(
            TokenInfo({
                paytoken: _paytoken,
                costvalue: _costvalue
            })
        );
    }

    function mintByETH(uint256 quantity) external payable {
        require(quantity + _numberMinted(msg.sender) <= MAX_MINTS, "Exceeded the limit");
        require(totalSupply() + quantity <= MAX_SUPPLY, "Not enough tokens left");
        require(msg.value >= (PRICE_PER_ETH * quantity), "Not enough ether sent");
        _safeMint(msg.sender, quantity);
    }

    function WLmintByETH(uint256 quantity) external payable {
        require(whitelisted[msg.sender] == true, "You are not white list");
        require(quantity + _numberMinted(msg.sender) <= MAX_MINTS, "Exceeded the limit");
        require(totalSupply() + quantity <= WL_MAX_SUPPLY, "Not enough tokens left");
        require(msg.value >= (WL_PRICE_PER_ETH * quantity), "Not enough ether sent");
        _safeMint(msg.sender, quantity);
    }

    function mintpid(address _to, uint256 quantity, uint256 _pid) public {
        TokenInfo storage tokens = AllowedCrypto[_pid];
        IERC20 paytoken = tokens.paytoken;
        uint256 costval = tokens.costvalue;

        require(quantity > 0, "Must mint at least one token");
        require(quantity <= maxPurchase, "Exceeds maximum purchase amount");
        require(totalSupply() + quantity <= MAX_SUPPLY, "Would exceed max supply");

        uint256 totalCost = costval * quantity;
        require(paytoken.transferFrom(msg.sender, address(this), totalCost), "ERC20 transfer failed");

        _safeMint(_to, quantity);
    }

    function withdraw() external onlyOwner nonReentrant {
        payable(owner()).transfer(address(this).balance);
    }

    function withdrawToken(uint pid) external onlyOwner {
        TokenInfo storage tokens = AllowedCrypto[pid];
        IERC20 paytoken = tokens.paytoken;
        uint256 balance = paytoken.balanceOf(address(this));
        require(balance > 0, "No token to withdraw");
        require(paytoken.transfer(owner(), balance), "Transfer failed");
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function getWLpublicSale() public view returns (uint256) {
        return WL_PRICE_PER_ETH;
    }

    function getpublicSale() public view returns (uint256) {
        return PRICE_PER_ETH;
    }

    function addWhitelist(address[] memory _users) public onlyOwner {
        for (uint256 i = 0; i < _users.length; i++) {
            address user = _users[i];
            if (!whitelisted[user]) {
                whitelisted[user] = true;
                numWhitelisted += 1;
            }
        }
    }

    function removeWhitelist(address[] memory _users) public onlyOwner {
        for (uint256 i = 0; i < _users.length; i++) {
            address user = _users[i];
            if (whitelisted[user]) {
                whitelisted[user] = false;
                numWhitelisted -= 1;
            }
        }
    }
}
