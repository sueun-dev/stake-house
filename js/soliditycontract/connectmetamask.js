const App = {
  web3Provider: null,
  currentAccount: null,
  connected: false,

  init: async function () {
    //처음 지갑 연결하는 구간
    await App.initWeb3();

    if (pageName === 'NFT') {
      await ERC721.pageInit();
    }
  },

  initWeb3: async function () {
    App.web3Provider = new Web3.providers.HttpProvider(
      config.network.rpcUrls[0],
    ); // Connect Node
    window.web3 = new Web3(App.web3Provider);

    if (window.ethereum) {
      try {
        await App.connect();
        await App.chnaged();
      } catch (error) {
        if (error.code === 4001) {
          // User rejected request
          alert('Please Connect MetaMask');
        }
        console.log(error);
      }
    } else {
      alert('There is no Metamask. Please install MetaMask.');
    }
  },

  switchNetwork: async function () {
    var currentchain = await ethereum.request({
      method: 'eth_chainId',
    });
    if(currentchain != '0x4') {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: '0x' + config.network.chainId.toString(16),
          },
        ],
      });
    }
    else {
      alert("You are in rinkeby")
    }
  },
  
  connect: async function () {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    App.currentAccount = accounts[0];
    App.connected = true;
  },

  chnaged: async function () {
    ethereum.on('accountsChanged', async () => {
      await App.connect();
    });
  },
 
  CheckId: async function () {
   var myAddress = window.ethereum.selectedAddress;
   var StartAddress = myAddress.substring(1,6);
   var EndAddress = myAddress.substring(37, myAddress.length);
   document.getElementById("Account").innerHTML = "Connected Address : " + StartAddress + "...." + EndAddress;
  },

  CheckMyETH1: async function () {
    // getBalance returns a BigInt in newer web3 versions
    var MyAccount = await web3.eth.getBalance(App.currentAccount);
    
    // Convert BigInt to string first, then to a number
    var MyAccountNumber = Number(MyAccount) / (10 ** 18);
    // Or use web3.utils.fromWei to convert from wei to ether
    // var MyAccountNumber = Number(web3.utils.fromWei(MyAccount, 'ether'));
    
    document.getElementById("CheckETH1").innerHTML = "You have : " + MyAccountNumber.toFixed(4) + " ETH";
},
  
  ConnectId: async function() {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    App.currentAccount = accounts[0];
    App.connected = true;
    },
  };

App.init();