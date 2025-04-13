const config = {
    contracts: {
      ERC721: {
        abi: abi.ERC721,
        address: NFT,
      },
    },
    network: {
      chainName: 'Sepolia Testnet',
      chainId: 11155111,
      nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: ['https://ethereum-sepolia-rpc.publicnode.com'],
      blockExplorerUrls: ['https://sepolia.etherscan.io/'],
    },
  };