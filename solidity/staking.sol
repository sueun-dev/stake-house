// SPDX-License-Identifier: MIT LICENSE

pragma solidity ^0.8.4;

import "../gomz_token.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/IERC721Receiver.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract NFTStaking is Ownable, IERC721Receiver {
    uint256 public totalStaked;
    
    struct Stake {
      uint24 tokenId;
      uint48 timestamp;
      address owner;
    }

    event NFTStaked(address owner, uint256 tokenId, uint256 value);
    event NFTUnstaked(address owner, uint256 tokenId, uint256 value);
    event Claimed(address owner, uint256 amount);

    ERC721Enumerable nft;
    GOMZTOKEN token;

    mapping(uint256 => Stake) public vault; 

     constructor(ERC721Enumerable _nft, GOMZTOKEN _token) Ownable(msg.sender) { 
      nft = _nft;
      token = _token;
    }

    function stake(uint256[] calldata tokenIds) external {
      uint256 tokenId;
      totalStaked += tokenIds.length;
      for (uint i = 0; i < tokenIds.length; i++) {
        tokenId = tokenIds[i];
        require(nft.ownerOf(tokenId) == msg.sender, "not your token");
        require(vault[tokenId].tokenId == 0, 'already staked');

        nft.transferFrom(msg.sender, address(this), tokenId);
        emit NFTStaked(msg.sender, tokenId, block.timestamp);

        vault[tokenId] = Stake({
          owner: msg.sender,
          tokenId: uint24(tokenId),
          timestamp: uint48(block.timestamp)
        });
      }
    }


    function claim(uint256[] calldata tokenIds) external {
        _claim(msg.sender, tokenIds, false);
    }

    function claimForAddress(address account, uint256[] calldata tokenIds) external {
        _claim(account, tokenIds, false);
    }

    function unstake(uint256[] calldata tokenIds) external {
        _claim(msg.sender, tokenIds, true);
    }

    function _unstakeMany(address account, uint256[] calldata tokenIds) internal {
      uint256 tokenId;
      totalStaked -= tokenIds.length;
      for (uint i = 0; i < tokenIds.length; i++) {
        tokenId = tokenIds[i];
        Stake memory staked = vault[tokenId];
        require(staked.owner == msg.sender, "not an owner");

        delete vault[tokenId];
        emit NFTUnstaked(account, tokenId, block.timestamp);
        nft.transferFrom(address(this), account, tokenId);
      }
    }

    function _claim(address account, uint256[] calldata tokenIds, bool _unstake) internal {
      uint256 tokenId;
      uint256 earned = 0;
      uint256 rewardmath = 0;

      for (uint i = 0; i < tokenIds.length; i++) {
        tokenId = tokenIds[i];
        Stake memory staked = vault[tokenId];
        require(staked.owner == account, "not an owner");
        uint256 stakedAt = staked.timestamp;
        rewardmath = 10000 ether * (block.timestamp - stakedAt) / 86400 ;
        earned = rewardmath / 100;
        vault[tokenId] = Stake({
          owner: account,
          tokenId: uint24(tokenId),
          timestamp: uint48(block.timestamp)
        });
      }

      if (earned > 0) {
        token.mint(account, earned);
      }

      if (_unstake) {
        _unstakeMany(account, tokenIds);
      }

      emit Claimed(account, earned);
    }

    function earningInfo(address account, uint256[] calldata tokenIds) external view returns (uint256[1] memory info) {
         uint256 tokenId;
         uint256 earned = 0;
         uint256 rewardmath = 0;

        for (uint i = 0; i < tokenIds.length; i++) {
          tokenId = tokenIds[i];
          Stake memory staked = vault[tokenId];
          require(staked.owner == account, "not an owner");
          uint256 stakedAt = staked.timestamp;
          rewardmath = 100 ether * (block.timestamp - stakedAt) / 86400;
          earned = rewardmath / 100;

        }
        if (earned > 0) {
          return [earned];
        }
    }

    function balanceOf(address account) public view returns (uint256) {
      uint256 balance = 0;
      uint256 supply = nft.totalSupply();
      for(uint i = 1; i <= supply; i++) {
        if (vault[i].owner == account) {
          balance += 1;
        }
      }
      return balance;
    }

    function tokensOfOwner(address account) public view returns (uint256[] memory ownerTokens) {

      uint256 supply = nft.totalSupply();
      uint256[] memory tmp = new uint256[](supply);

      uint256 index = 0;
      for(uint tokenId = 0; tokenId <= supply; tokenId++) {
        if (vault[tokenId].owner == account) {
          tmp[index] = vault[tokenId].tokenId;
          index +=1;
        }
      }

      uint256[] memory tokens = new uint256[](index);
      for(uint i = 0; i < index; i++) {
        tokens[i] = tmp[i];
      }

      return tokens;
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
        ) external pure override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

}