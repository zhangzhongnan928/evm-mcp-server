const { ethers } = require('ethers');
const { AppError } = require('../middleware/errorHandler');
const { setupLogging } = require('../utils/logger');
const { getProvider } = require('./providerService');

const logger = setupLogging();

/**
 * Get contract instance
 * @param {string} address Contract address
 * @param {string} chainId Chain ID (optional)
 * @returns {Object} Contract information including ABI
 */
async function getContract(address, chainId) {
  try {
    // Validate address
    if (!ethers.isAddress(address)) {
      throw new AppError(`Invalid contract address: ${address}`, 400);
    }
    
    // Get provider for the specified chain
    const provider = getProvider(chainId);
    
    // In a real implementation, we would:
    // 1. Check if we have the ABI cached
    // 2. If not, fetch it from Etherscan or similar API
    // 3. Create and return the contract instance
    
    // For this example, we'll return a mock ABI for an ERC20 token
    const mockAbi = [
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function decimals() view returns (uint8)",
      "function totalSupply() view returns (uint256)",
      "function balanceOf(address) view returns (uint256)",
      "function transfer(address to, uint256 amount) returns (bool)",
      "function allowance(address owner, address spender) view returns (uint256)",
      "function approve(address spender, uint256 amount) returns (bool)",
      "function transferFrom(address from, address to, uint256 amount) returns (bool)",
      "event Transfer(address indexed from, address indexed to, uint256 value)",
      "event Approval(address indexed owner, address indexed spender, uint256 value)"
    ];
    
    // Create contract instance
    const contract = new ethers.Contract(address, mockAbi, provider);
    
    return {
      address,
      chainId: chainId || 'default',
      abi: mockAbi,
      contract
    };
  } catch (error) {
    logger.error(`Error getting contract: ${error.message}`, { address, chainId, stack: error.stack });
    throw error;
  }
}

/**
 * Call a read-only contract function
 * @param {string} address Contract address
 * @param {string} functionName Name of the function to call
 * @param {Array} args Arguments for the function
 * @param {string} chainId Chain ID (optional)
 * @returns {any} Function result
 */
async function getContractFunction(address, functionName, args = [], chainId) {
  try {
    // Get contract
    const { contract } = await getContract(address, chainId);
    
    // Check if function exists
    if (!contract[functionName]) {
      throw new AppError(`Function ${functionName} not found in contract`, 400);
    }
    
    // Call function
    const result = await contract[functionName](...args);
    
    return result;
  } catch (error) {
    logger.error(`Error calling contract function: ${error.message}`, { 
      address, 
      functionName, 
      args, 
      chainId, 
      stack: error.stack 
    });
    throw error;
  }
}

module.exports = {
  getContract,
  getContractFunction
};
