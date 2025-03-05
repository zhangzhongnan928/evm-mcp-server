const { AppError } = require('../middleware/errorHandler');
const { setupLogging } = require('../utils/logger');
const { getProvider } = require('./providerService');

const logger = setupLogging();

/**
 * Get transaction receipt
 * @param {string} txHash Transaction hash
 * @param {string} chainId Chain ID (optional)
 * @returns {Object} Transaction receipt
 */
async function getTransactionReceipt(txHash, chainId) {
  try {
    // Get provider for the specified chain
    const provider = getProvider(chainId);
    
    // Get transaction receipt
    const receipt = await provider.getTransactionReceipt(txHash);
    
    if (!receipt) {
      throw new AppError(`Transaction ${txHash} not found`, 404);
    }
    
    return receipt;
  } catch (error) {
    logger.error(`Error getting transaction receipt: ${error.message}`, { 
      txHash, 
      chainId, 
      stack: error.stack 
    });
    throw error;
  }
}

/**
 * Get transaction status
 * @param {string} txHash Transaction hash
 * @param {string} chainId Chain ID (optional)
 * @returns {Object} Transaction status
 */
async function getTransactionStatus(txHash, chainId) {
  try {
    // Get provider for the specified chain
    const provider = getProvider(chainId);
    
    // Get transaction
    const tx = await provider.getTransaction(txHash);
    
    if (!tx) {
      throw new AppError(`Transaction ${txHash} not found`, 404);
    }
    
    // Get receipt if transaction is mined
    let receipt = null;
    if (tx.blockNumber) {
      receipt = await provider.getTransactionReceipt(txHash);
    }
    
    return {
      hash: txHash,
      status: receipt ? (receipt.status ? 'success' : 'failed') : 'pending',
      blockNumber: tx.blockNumber,
      confirmations: tx.blockNumber ? await provider.getBlockNumber() - tx.blockNumber + 1 : 0,
      from: tx.from,
      to: tx.to,
      value: tx.value.toString(),
      gasUsed: receipt ? receipt.gasUsed.toString() : null,
      effectiveGasPrice: receipt ? receipt.effectiveGasPrice.toString() : null
    };
  } catch (error) {
    logger.error(`Error getting transaction status: ${error.message}`, { 
      txHash, 
      chainId, 
      stack: error.stack 
    });
    throw error;
  }
}

/**
 * Estimate gas for a transaction
 * @param {Object} txParams Transaction parameters
 * @param {string} chainId Chain ID (optional)
 * @returns {string} Gas estimate
 */
async function estimateGas(txParams, chainId) {
  try {
    // Get provider for the specified chain
    const provider = getProvider(chainId);
    
    // Estimate gas
    const gasEstimate = await provider.estimateGas(txParams);
    
    return gasEstimate.toString();
  } catch (error) {
    logger.error(`Error estimating gas: ${error.message}`, { 
      txParams, 
      chainId,

      stack: error.stack 
    });
    throw error;
  }
}

module.exports = {
  getTransactionReceipt,
  getTransactionStatus,
  estimateGas
};
