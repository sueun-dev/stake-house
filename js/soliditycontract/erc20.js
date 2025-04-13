const ERC20 = {
    /* 
    getMyBalance: This function retrieves the token balance of the user's account and updates the innerHTML of an element with the ID GOMZAmount. 
    It does this by calling the balanceOf method of the ERC20 token contract and converting the balance from wei to ether.
    */
    getMyBalance: async function () {
      const contract = new web3.eth.Contract(abi.ERC20Token, TOKEN);
      const balance = await contract.methods.balanceOf(App.currentAccount).call(); // returns string
    
      // Convert using Web3 utility
      const ethBalance = parseFloat(web3.utils.fromWei(balance, 'ether')).toFixed(3);
    
      document.getElementById('GOMZAmount').textContent = `${ethBalance} SH`;
    },
    
    
    /*
    approveBuyNFT: This function approves the transfer of a certain amount of tokens (in this case, 100 tokens) to a specified NFT contract.
    It creates and sends an Ethereum transaction with the encoded ABI data of the approval.
    */
    approveBuyNFT: async function () {
      const contract = new web3.eth.Contract(abi.ERC20Token, TOKEN);
      const evmData = contract.methods.approve(NFT, web3.utils.toWei("100000", "ether")).encodeABI();
  
      const params = [
        {
          from: App.currentAccount,
          to: TOKEN,
          data: evmData,
        },
      ];
  
      ethereum.request({
        method: 'eth_sendTransaction',
        params,
      });
    },

    /*
    addTokenOnMetaMask: This function adds the ERC20 token to the user's MetaMask wallet by calling the wallet_watchAsset method. 
    It takes the token's symbol, decimals, and image URL as parameters.
    */
    addTokenOnMetaMask: async function () {
      const tokenSymbol = 'SH';
      const tokenDecimals = 18;
      const tokenImage = 'https://i.ibb.co/Y45DcXhF/Chat-GPT-Image-Apr-12-2025-02-12-52-PM.png';
  
      try {
        await ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: TOKEN,
              symbol: tokenSymbol,
              decimals: tokenDecimals,
              image: tokenImage,
            },
          },
        });
      } catch (error) {
        console.error('Failed to add token:', error);
      }
    },
  };
  