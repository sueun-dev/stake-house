function scheduler(action, ms = 1000, runRightNow = true) {
  if (runRightNow) {
    action();
  }
  setInterval(action, ms);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let weitoeth = 1000000000000000000;

const ERC721 = {
  contract: null,
  baseURI: '',

  init: async function () {
    this.contract = new web3.eth.Contract(config.contracts.ERC721.abi, config.contracts.ERC721.address);
  },

  pageInit: async function () {
    scheduler(this.writeTotalSupply, 1000);
    scheduler(this.fEaringInfo, 2000);
    if (App.connected) {
      this.showMyNFTs();
      this.stakegetMetadata();
    }
  },

  fSendTransaction: async function (to, evmData) {
    const params = [
      {
        from: App.currentAccount,
        to: to,
        data: evmData,
      },
    ];
    return ethereum.request({ method: 'eth_sendTransaction', params });
  },
  
  sendTransaction: async function (evmData, value = null) {
    const params = [
      {
        from: App.currentAccount,
        to: config.contracts.ERC721.address,
        data: evmData,
        value,
      },
    ];
    return ethereum.request({ method: 'eth_sendTransaction', params });
  },
  
  fMintWithETH: async function () {
    if (!this.contract) {
      await ERC721.init();
    }
  
    const getMyPrice = 0.001;
    const numberOfTokens = document.getElementById('public-number-of-tokens').value;
    const ethAmountStr = (numberOfTokens * getMyPrice).toString();
    const valueInWei = parseInt(web3.utils.toWei(ethAmountStr, 'ether')).toString(16);
    const valueHex = '0x' + valueInWei;
    const evmData = this.contract.methods.mintByETH(numberOfTokens).encodeABI();
    await ERC721.sendTransaction(evmData, valueHex);
},
  
  fTokenmintWithETH: async function () {
    const numberOfTokens2 = document.getElementById('tokenBuy-number-of-tokens').value;
  
    const cTokenmintWithETH = new web3.eth.Contract(config.contracts.ERC721.abi, config.contracts.ERC721.address);
    const evmData = cTokenmintWithETH.methods
      .mintpid(App.currentAccount, numberOfTokens2, 0)
      .encodeABI();
  
    console.log(evmData);
  
    await ERC721.sendTransaction(evmData);
  },

  setApprovalForAll: async function() {
    cSetApprovalForAll = new web3.eth.Contract(config.contracts.ERC721.abi, config.contracts.ERC721.address);
    const evmData = cSetApprovalForAll.methods
      .setApprovalForAll(STAKINGCONTRACT, true)
      .encodeABI();
  
      const params = [
        {
          from: App.currentAccount,
          to: config.contracts.ERC721.address,
          data: evmData
        },
      ];
      ethereum
        .request({
          method: 'eth_sendTransaction',
          params,
        })
    },

    WLmintWithETH: async function () {
      if (!this.contract) {
        await ERC721.init(); // 혹시 안 됐으면 초기화
      }
    
      var getMyWLPrice = 0.0001;
      const numberOfTokens1 = document.getElementById('number-of-tokens1').value;
      
      if (numberOfTokens1 > 10) {
        return alert('only mint 10 NFT at a time');
      }
      
      // ETH 금액 계산
      const ethAmountStr = (numberOfTokens1 * getMyWLPrice).toString();
      
      // ETH 금액을 wei 단위로 변환한 후 16진수 문자열로 변환
      const valueInWei = parseInt(web3.utils.toWei(ethAmountStr, 'ether')).toString(16);
      console.log("Converted value in Wei (hex):", valueInWei);
      
      // 16진수 문자열 앞에 0x 접두사 추가
      const valueHex = '0x' + valueInWei;
      
      const evmData = this.contract.methods.WLmintByETH(numberOfTokens1).encodeABI();
    
      await ERC721.sendTransaction(evmData, valueHex);
    },


  toFixed: function(x) {
    if (Math.abs(x) < 1.0) {
      var e = parseInt(x.toString().split('e-')[1]);
      if (e) {
        x *= Math.pow(10,e-1);
        x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
      }
    } else {
      var e = parseInt(x.toString().split('+')[1]);
      if (e > 20) {
        e -= 20;
        x /= Math.pow(10,e);
        x += (new Array(e+1)).join('0');
      }
    }
    return x;
  },


  getTotalSupply: async function () {

    gTotalSupply = new web3.eth.Contract(config.contracts.ERC721.abi, config.contracts.ERC721.address);
    return await gTotalSupply.methods.totalSupply().call();
  },

  writeTotalSupply: async function () {
    document.getElementById('total-supply').innerHTML = await ERC721.getTotalSupply();
  },


  getBalanceOf: async function (address) {
    gBalanceOf = new web3.eth.Contract(config.contracts.ERC721.abi, config.contracts.ERC721.address);
    return await gBalanceOf.methods.balanceOf(address).call();
  },

  getOwnerOf: async function (OwnerOfId) {
    gOwnerOf = new web3.eth.Contract(config.contracts.ERC721.abi, config.contracts.ERC721.address);
    return await gOwnerOf.methods.ownerOf(OwnerOfId).call();
  },

  transferToken: async function (tokenId) {
    const toAddress = prompt(`send your #${tokenId}, input toAddress`);
  
    if (!toAddress) {
      alert("Canceled");
      return;
    }
  
    if (!web3.utils.isAddress(toAddress)) {
      alert("Invalid address. Please enter a valid Ethereum address.");
      return;
    }
  
    const contract = new web3.eth.Contract(config.contracts.ERC721.abi, config.contracts.ERC721.address);
    const evmData = contract.methods.transferFrom(App.currentAccount, toAddress, tokenId).encodeABI();
  
    const params = [
      {
        from: App.currentAccount,
        to: config.contracts.ERC721.address,
        data: evmData,
        value: '0x0',
      },
    ];
  
    ethereum.request({
      method: 'eth_sendTransaction',
      params,
    });
  },  

  getMetadata: async function (tokenId) {
    //cahnge tokenURI
    const tokenURI = "https://aqua-statistical-wren-893.mypinata.cloud/ipfs/bafybeia3sc66leodkrwtdrmth5jlpsphbb2hmrfnatlu5vqerejwlokmo4/" + tokenId; 
    const result = await fetch(tokenURI);
    return await result.json();
  },

  imgDiv: function () {
    div = document.createElement('div');
    div.classList.add('col');
    div.style = 'width: 25%;';
  },

  imgCard: function () {
    card = document.createElement('div');
    card.classList.add('card');
    card.classList.add('h-100');
  },

  makeNFTElement: function (tokenId, imagePath, attribute) {
    this.imgDiv();
    this.imgCard();
    div.appendChild(card);

    const img = document.createElement('img');
    img.classList.add('card-img-top');
    img.src = imagePath;
    img.alt = '...refresh homepage please';

    card.appendChild(img);

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    cardBody.style.whiteSpace = 'nowrap';
    cardBody.style.overflow = 'hidden';    
    cardBody.style.textOverflow = 'ellipsis'; 
    cardBody.style.fontSize = '0.9rem'; 
    const title = document.createElement('p');
    title.classList.add('card-title');
    title.innerText = `#${tokenId}`;

    const stakeBtn = document.createElement('button');
    stakeBtn.classList.add('btn', 'btn-primary');
    stakeBtn.innerText = 'stake';

    stakeBtn.style.cssText = `
  display: block;
  margin: 0 auto;
  padding: 6px 12px;
  font-size: 0.85rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  `;

    stakeBtn.onclick = function () {
      ERC721.imgstake(tokenId);
    };

      cardBody.appendChild(title);
    cardBody.appendChild(stakeBtn);
    card.appendChild(cardBody);

    return div;
  },

  unstakemakeNFTElement: function (tokenId, imagePath, attribute, earn) {
    this.imgDiv();
    this.imgCard();
    div.appendChild(card);
    
    // 이미지 부분
    const img = document.createElement('img');
    img.classList.add('card-img-top');
    if(img.alt = true) {
      img.src = imagePath;
    }
    img.alt = '...refresh homepage please';
    card.appendChild(img);

    
    // 카드 정보 부분
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
  
    const title = document.createElement('p');
    title.classList.add('card-title');
    title.innerText = `#${tokenId}`;
  
    // 버튼으로 변경: button 태그 사용 및 btn 클래스 추가
    const unstakeBtn = document.createElement('button');
    unstakeBtn.classList.add('btn', 'btn-secondary'); // 버튼 클래스 추가
    unstakeBtn.innerText = 'Unstake';
    
    // 스타일 적용 (stake 버튼과 유사하게)
    unstakeBtn.style.cssText = `
      display: block;
      margin: 0 auto;
      padding: 6px 12px;
      font-size: 0.85rem;
      background: linear-gradient(135deg, #ff006e, #8338ec);
      color: white;
      border: none;
      border-radius: 50px;
      cursor: pointer;
      text-align: center;
    `;
  
    unstakeBtn.onclick = function () {
      ERC721.imgunstake(tokenId);
    };
    
    cardBody.appendChild(title);
    cardBody.appendChild(unstakeBtn); // 수정된 버튼 추가
    card.appendChild(cardBody);
    
    return div;
  },
  
  allmakeNFTElement: function (tokenId, imagePath, attribute) {
    {
      // card
      this.imgDiv();
      this.imgCard();
      div.appendChild(card);
    
      {
        // image
        const img = document.createElement('img');
        img.classList.add('card-img-top');
        img.src = imagePath;
        img.alt = '...refresh homepage please';
        card.appendChild(img);

      }
      {
        // desc
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const title = document.createElement('p');
        title.classList.add('card-title');
        title.innerText = `#${tokenId}`;

        cardBody.appendChild(title);
        card.appendChild(cardBody);

      }
    }
    return div;
  },

  showMyNFTs: async function () {
    const balance = await ERC721.getBalanceOf(App.currentAccount);
    const total = await ERC721.getTotalSupply();
    let ownerCount = 0;
    
    for (const index of Array.from(Array(Number(total)).keys())) {
      const tokenId = index;
      const owner = await ERC721.getOwnerOf(tokenId);
      if (owner.toLowerCase() == App.currentAccount.toLowerCase()) {
        ownerCount += 1;
        ERC721.appendNFT(tokenId);
        await sleep(1500);// for Pinata GWS req limit
        if (balance <= ownerCount) {
          break;
        };
      }
    }
  },

  updateDiv: function () {
    const container = document.getElementById('my-nft-list');
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  
    const span = document.createElement('span');
    span.className = 'empty-message';
    span.innerText = 'Loading your NFTs...';
    container.appendChild(span);
  },
  

  reloadappendNFT: async function () {
    const refreshBtn = document.getElementById("thisk");
    
    // 이미 비활성화된 경우 함수 종료
    if (refreshBtn.disabled) {
      return;
    }
    
    // 버튼 비활성화
    refreshBtn.disabled = true;
    
    // 원래 버튼 텍스트 저장
    const originalText = refreshBtn.innerHTML;
    
    // 두 탭 모두 비우기
    ERC721.updateDiv();
    ERC721.updateStakeDiv();
    
    // 두 탭 모두 다시 로드
    await ERC721.showMyNFTs();
    await ERC721.stakegetMetadata();
    
    // 현재 활성화된 탭 가져오기
    const activeTab = document.querySelector('.gallery-tab.active');
    const targetId = activeTab ? activeTab.getAttribute('data-target') : null;
    
    // 각 탭 콘텐츠에 대한 참조 가져오기
    const yourCollectionTab = document.getElementById('your-collection');
    const stakedNftsTab = document.getElementById('staked-nfts');
    
    // 소유한 NFT 및 스테이킹된 NFT의 실제 개수 확인
    const ownedNftCount = document.querySelectorAll('#my-nft-list > div').length;
    const stakedNftCount = document.querySelectorAll('#stake-my-nft-list > div').length;
    
    // 안내 메시지 요소 확인
    const ownedEmptyMsg = document.querySelector('#my-nft-list .empty-message');
    const stakedEmptyMsg = document.querySelector('#stake-my-nft-list .empty-message');
    
    // 적절한 탭 표시 및 활성화
    if (ownedNftCount > 0 && stakedNftCount === 0) {
      // 소유한 NFT만 있는 경우 Your Collection 탭 활성화
      document.querySelectorAll('.gallery-tab').forEach(tab => tab.classList.remove('active'));
      document.querySelector('.gallery-tab[data-target="your-collection"]').classList.add('active');
      yourCollectionTab.style.display = '';
      stakedNftsTab.style.display = 'none';
    } else if (ownedNftCount === 0 && stakedNftCount > 0) {
      // 스테이킹된 NFT만 있는 경우 Staked NFTs 탭 활성화
      document.querySelectorAll('.gallery-tab').forEach(tab => tab.classList.remove('active'));
      document.querySelector('.gallery-tab[data-target="staked-nfts"]').classList.add('active');
      yourCollectionTab.style.display = 'none';
      stakedNftsTab.style.display = '';
    } else {
      // 둘 다 있거나 둘 다 없는 경우 원래 선택된 탭 유지
      if (targetId === 'staked-nfts') {
        yourCollectionTab.style.display = 'none';
        stakedNftsTab.style.display = '';
      } else {
        yourCollectionTab.style.display = '';
        stakedNftsTab.style.display = 'none';
      }
    }
    
    // 빈 상태 메시지 처리
    if (ownedNftCount === 0 && !ownedEmptyMsg) {
      const span = document.createElement('span');
      span.className = 'empty-message';
      span.innerText = 'You don\'t have any NFTs in your collection';
      document.getElementById('my-nft-list').appendChild(span);
    }
    
    if (stakedNftCount === 0 && !stakedEmptyMsg) {
      const span = document.createElement('span');
      span.className = 'empty-message';
      span.innerText = 'You don\'t have any staked NFTs';
      document.getElementById('stake-my-nft-list').appendChild(span);
    }
    
    // 30초 타이머 시작 (매초마다 버튼 텍스트 업데이트)
    let secondsLeft = 30;
    
    const countdownInterval = setInterval(function() {
      secondsLeft--;
      refreshBtn.innerHTML = `<i class="fas fa-sync"></i> Wait ${secondsLeft}s`;
      
      if (secondsLeft <= 0) {
        // 타이머 종료, 버튼 다시 활성화
        clearInterval(countdownInterval);
        refreshBtn.disabled = false;
        refreshBtn.innerHTML = originalText;
      }
    }, 1000);
  },
  
  // 스테이킹 탭 비우는 함수 추가
  updateStakeDiv: function() {
    const container = document.getElementById('stake-my-nft-list');
    
    // 기존 콘텐츠 제거
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    
    // 안내 메시지 추가
    const span = document.createElement('span');
    span.className = 'empty-message';
    span.innerText = 'Loading staked NFTs...';
    container.appendChild(span);
  },

  appendNFT: async function (tokenId) {
    const metadata = await ERC721.getMetadata(tokenId);
    const nftElement = ERC721.makeNFTElement(
      tokenId,
      metadata.image,
      metadata.attributes,
    );
    document.getElementById('my-nft-list').appendChild(nftElement);
    const tmp = document.querySelector('#my-nft-list span');
    if (tmp) {
      tmp.remove();
    }
  },

  // Helper function for staking contract transactions
  stakingTransaction: async function(methodName, params) {
    const contract = new web3.eth.Contract(abi.VAULTABI, STAKINGCONTRACT);
    const evmData = contract.methods[methodName](...params).encodeABI();
    
    const txParams = [
      {
        from: App.currentAccount,
        to: STAKINGCONTRACT,
        data: evmData,
        value: '0x0',
      },
    ];
    
    return ethereum.request({
      method: 'eth_sendTransaction',
      params: txParams,
    });
  },

  stake: async function () {
    const tokenids = Number(document.getElementById('stakeit').value);
    return this.stakingTransaction('stake', [[tokenids]]);
  },

  unstake: async function () {
    const tokenids = Number(document.getElementById('unstakeit').value);
    return this.stakingTransaction('unstake', [[tokenids]]);
  },

  claim1: async function () {
    const tokenids = document.getElementById('claim1').value;
    const word = tokenids.split(',').map(Number);
    return this.stakingTransaction('claim', [word]);
  },

  imgstake: async function (tokenids1) {  
    const tokenids = Number(tokenids1);
    return this.stakingTransaction('stake', [[tokenids]]);
  },

  imgunstake: async function (tokenids1) {
    const tokenids = Number(tokenids1);
    return this.stakingTransaction('unstake', [[tokenids]]);
  },

  allStakeNumberStake: async function () {
    var Total = 0;
    cAllStakeNumberStake = new web3.eth.Contract(abi.VAULTABI, STAKINGCONTRACT);
    earnin = await cAllStakeNumberStake.methods.tokensOfOwner(App.currentAccount).call();
    console.log(earnin);
    for(var i = 0; i < earnin.length; i++) {
      Total++;
    }

    document.getElementById('test').innerHTML = 
    Total;
  },

  stakegetMetadata: async function () {
    cStakeGetMetadata = new web3.eth.Contract(abi.VAULTABI, STAKINGCONTRACT);
    var earn = [];
    var arr = [];

    arr = await cStakeGetMetadata.methods.tokensOfOwner(App.currentAccount).call();

    for(let i = 0; i < arr.length; i++) {
      console.log(ERC721.baseURI + arr[i]);
      const metadata = await ERC721.getMetadata(arr[i]);
      earn = await cStakeGetMetadata.methods.earningInfo(App.currentAccount, [arr[i]]).call();
      
      earn = (earn / ERC721.toFixed(10 ** 18)).toFixed(2);
      const nftElement = ERC721.unstakemakeNFTElement(
        arr[i],
        metadata.image,
        metadata.attributes,
        earn
      );
      console.log(nftElement);
      document.getElementById('stake-my-nft-list').appendChild(nftElement);

      const tmp = document.querySelector('#stake-my-nft-list span');
      if (tmp) {
        tmp.remove();
      }
    }
  },

  fEaringInfo: async function () {
    const cStakeGetMetadata = new web3.eth.Contract(abi.VAULTABI, STAKINGCONTRACT);
    const arr = await cStakeGetMetadata.methods.tokensOfOwner(App.currentAccount).call();
    let checkedItem1 = "";
  
    for (let i = 0; i < arr.length; i++) {
      const result = await cStakeGetMetadata.methods.earningInfo(App.currentAccount, [arr[i]]).call();
      const earnedRaw = result[0];
      const earnedETH = parseFloat(web3.utils.fromWei(earnedRaw, 'ether')).toFixed(3);

      if (i % 2 === 0) {
        checkedItem1 += `${arr[i]} NFT EARN: ${earnedETH} SH, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`;
      } else {
        checkedItem1 += `${arr[i]} NFT EARN: ${earnedETH} SH<br>`;
      }
    }
  
    document.getElementById('GetEarn').innerHTML = checkedItem1;
  },

  imgstake: async function (tokenids1) {  
    const tokenids = Number(tokenids1);
    return this.stakingTransaction('stake', [[tokenids]]);
  },

  imgunstake: async function (tokenids1) {
    const tokenids = Number(tokenids1);
    return this.stakingTransaction('unstake', [[tokenids]]);
  },
};