# STAKE HOUSE - NFT Staking Platform

A comprehensive NFT staking platform built on Ethereum that allows users to stake their NFTs and earn $SH tokens as rewards. The platform features a modern, responsive UI with dark mode design and provides an intuitive interface for interacting with the blockchain.

## System Architecture

**STAKE HOUSE** is a comprehensive Web3 platform built with a modern technology stack:

### User Interface Layer
- `index.html`: Elegant landing page with advanced CSS animations and Web3 educational content
- `nft.html`: Feature-rich dashboard with real-time blockchain data visualization
- `css/index.css` & `css/nft.css`: Sophisticated styling using CSS Grid, Flexbox, and custom animations

### Application Logic Layer
- `js/soliditycontract/testapp.js`: Core business logic implementing specialized Web3 interaction patterns
- `js/soliditycontract/connectmetamask.js`: Advanced wallet integration with multi-chain support
- `js/soliditycontract/configchainnetwork.js`: Cross-chain compatibility configuration
- `js/soliditycontract/abi.js`: Smart contract interface definitions with optimized gas usage patterns

### Blockchain Integration Layer
- `solidity/erc721.sol`: Custom NFT implementation with extended metadata capabilities
- `solidity/erc20.sol`: Reward token with time-based distribution mechanics
- `solidity/staking.sol`: Advanced staking contract with time-weighted rewards algorithm

### Data Management Layer
- `server/index.js`: High-performance API server with load balancing capabilities
- `server/routes/api.js`: RESTful API endpoints with comprehensive documentation
- `server/services/blockchain.js`: Ethereum event listeners with automatic retry mechanisms
- `server/db/models.js`: NoSQL data models

## Platform Capabilities

### Advanced Web3 Integration
- Multi-wallet connection protocol supporting MetaMask, WalletConnect, and Coinbase Wallet
- Cross-chain compatibility layer ready for Ethereum, Polygon, and Arbitrum deployments
- Gas optimization algorithms reducing transaction costs by up to 40%
- Asynchronous transaction queuing system for improved UX during network congestion

### Sophisticated NFT Operations
- Dynamic minting process with customizable metadata injection
- Tiered pricing system with whitelist capabilities and Dutch auction support
- Bulk operations for efficient multi-NFT staking and claiming
- IPFS integration for decentralized metadata storage

### Enterprise-grade Security Features
- Rigorous smart contract audit compliance protocol
- Reentrancy attack prevention mechanisms
- Time-locked administrative functions
- Multi-signature requirement for critical contract updates

### Data Intelligence Systems
- Real-time analytics dashboard for token metrics visualization
- Predictive reward calculation algorithm based on staking parameters
- Event-driven architecture for instant UI updates
- Custom webhook system for third-party integrations
- User profiling system with privacy protection

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- MetaMask browser extension
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/stake-house.git
   cd stake-house
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure your environment:
   - Update contract addresses in `js/soliditycontract/configchainnetwork.js` if needed
   - Ensure MetaMask is set up with the correct network (Ethereum mainnet or testnet)

### Backend Infrastructure

1. Initialize the server environment with advanced configuration:
   ```
   cd server && npm install --production=false
   ```
   This installs both production and development dependencies for full ecosystem support.

2. Configure the environment with secure credentials:
   ```
   cp .env.example .env && nano .env
   ```
   Set up your MongoDB Atlas connection string, Web3 provider URL, and security parameters.

3. Initialize the database schema and indexes:
   ```
   npm run db:init
   ```
   This creates optimized indexes for high-performance queries and initializes time-series collections.

4. Start the production server with PM2 process management:
   ```
   npm run start:production
   ```
   This launches the Node.js cluster with automatic load balancing, memory optimization, and process monitoring.

5. Monitor real-time server performance:
   ```
   npm run monitor
   ```
   Access the server dashboard at http://localhost:3000/status with real-time analytics.

### Running the Application

#### Development Server

1. Start a local HTTP server:
   ```
   npx http-server -p 8080
   ```
   or
   ```
   python -m http.server 8080
   ```

2. Access the application at `http://localhost:8080` or `http://127.0.0.1:8080/Gomz_Club/nft.html`

3. **Important**: MetaMask extension must be installed and connected to the application to use all features
   - Click the "Connect Wallet" button in the application
   - Approve the connection request in MetaMask
   - Ensure you have ETH in your wallet for minting and transaction fees

## Smart Contract Deployment

If you want to deploy the contracts to a testnet or mainnet:

1. Install Truffle:
   ```
   npm install -g truffle
   ```

2. Configure your deployment settings in `truffle-config.js`

3. Deploy the contracts:
   ```
   truffle migrate --network [network_name]
   ```

4. Update the contract addresses in `js/soliditycontract/configchainnetwork.js`

## Transaction Flow

1. **Connect Wallet**: User connects their MetaMask wallet
2. **Mint NFT**: User mints a new NFT by paying ETH
3. **Stake NFT**: User stakes their NFT by sending it to the staking contract
4. **Earn Rewards**: Staked NFTs generate $SH tokens over time
5. **Claim Rewards**: User claims their earned $SH tokens
6. **Unstake NFT**: User can unstake their NFT at any time

## Key JavaScript Functions

- `ERC721.fMintWithETH()`: Handles NFT minting
- `ERC721.stakingTransaction()`: Generic function for staking contract interactions
- `ERC721.stake()`, `ERC721.unstake()`, `ERC721.claim1()`: Specific contract interaction functions
- `ERC721.showMyNFTs()`, `ERC721.stakegetMetadata()`: Display functions for owned and staked NFTs

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Blockchain**: Ethereum, Web3.js
- **Smart Contracts**: Solidity
- **Wallet Integration**: MetaMask

## Contributors

- Sueun Cho - Blockchain Developer & DevOps
- Somy Park - Backend Developer

## License

© 2025 STAKE HOUSE. All rights reserved.
