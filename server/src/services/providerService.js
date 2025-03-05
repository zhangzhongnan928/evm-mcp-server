const { ethers } = require('ethers');
const { setupLogging } = require('../utils/logger');

const logger = setupLogging();

// Cache for providers to avoid creating new instances for each request
const providerCache = new Map();

/**
 * RPC URLs for different chains, ideally these would be in environment variables
 */
const rpcUrls = {
  // Mainnet
  '1': process.env.MAINNET_RPC_URL || 'https://eth-mainnet.alchemyapi.io/v2/demo',
  // Goerli Testnet
  '5': process.env.GOERLI_RPC_URL || 'https://eth-goerli.alchemyapi.io/v2/demo',
  // Sepolia Testnet
  '11155111': process.env.SEPOLIA_RPC_URL || 'https://eth-sepolia.alchemyapi.io/v2/demo',
  // Arbitrum
  '42161': process.env.ARBITRUM_RPC_URL || 'https://arb-mainnet.g.alchemy.com/v2/demo',
  // Optimism
  '10': process.env.OPTIMISM_RPC_URL || 'https://opt-mainnet.g.alchemy.com/v2/demo',
  // Polygon
  '137': process.env.POLYGON_RPC_URL || 'https://polygon-mainnet.g.alchemy.com/v2/demo',
  // BSC
  '56': process.env.BSC_RPC_URL || 'https://bsc-dataseed.binance.org',
  // Avalanche
  '43114': process.env.AVALANCHE_RPC_URL || 'https://api.avax.network/ext/bc/C/rpc',
  // Hardhat/localhost
  '31337': process.env.LOCAL_RPC_URL || 'http://127.0.0.1:8545',
  // Default to Ethereum mainnet
  'default': process.env.DEFAULT_RPC_URL || 'https://eth-mainnet.alchemyapi.io/v2/demo'
};

/**
 * Get provider for specified chain
 * @param {string} chainId Chain ID
 * @returns {ethers.Provider} Provider instance
 */
function getProvider(chainId = 'default') {
  try {
    // Normalize chainId
    const normalizedChainId = chainId?.toString() || 'default';
    
    // Check cache first
    if (providerCache.has(normalizedChainId)) {
      return providerCache.get(normalizedChainId);
    }
    
    // Get RPC URL for the chain
    const rpcUrl = rpcUrls[normalizedChainId] || rpcUrls.default;
    
    // Create provider
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    
    // Cache provider
    providerCache.set(normalizedChainId, provider);
    
    return provider;
  } catch (error) {
    logger.error(`Error creating provider: ${error.message}`, { chainId, stack: error.stack });
    throw error;
  }
}

/**
 * Clear provider cache
 * Useful for testing or when RPC URLs change
 */
function clearProviderCache() {
  providerCache.clear();
}

module.exports = {
  getProvider,
  clearProviderCache
};
