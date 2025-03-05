const express = require('express');
const { AppError } = require('../middleware/errorHandler');
const { setupLogging } = require('../utils/logger');
const { getContract, getContractFunction } = require('../services/contractService');

const router = express.Router();
const logger = setupLogging();

/**
 * Get contract info
 * GET /api/contracts/:address
 */
router.get('/:address', async (req, res, next) => {
  try {
    const { address } = req.params;
    const { chainId } = req.query;
    
    if (!address) {
      throw new AppError('Contract address is required', 400);
    }
    
    const contractInfo = await getContract(address, chainId);
    
    res.status(200).json({
      success: true,
      data: contractInfo
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get contract ABI
 * GET /api/contracts/:address/abi
 */
router.get('/:address/abi', async (req, res, next) => {
  try {
    const { address } = req.params;
    const { chainId } = req.query;
    
    if (!address) {
      throw new AppError('Contract address is required', 400);
    }
    
    const contractInfo = await getContract(address, chainId);
    
    res.status(200).json({
      success: true,
      data: {
        address,
        chainId: chainId || 'default',
        abi: contractInfo.abi
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Call read-only contract function
 * GET /api/contracts/:address/call/:functionName
 */
router.get('/:address/call/:functionName', async (req, res, next) => {
  try {
    const { address, functionName } = req.params;
    const { chainId } = req.query;
    const args = req.query.args ? JSON.parse(req.query.args) : [];
    
    if (!address || !functionName) {
      throw new AppError('Contract address and function name are required', 400);
    }
    
    logger.info(`Calling contract function: ${functionName}`, { address, chainId, args });
    
    const result = await getContractFunction(address, functionName, args, chainId);
    
    res.status(200).json({
      success: true,
      data: {
        address,
        functionName,
        result
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Prepare transaction data for contract function
 * POST /api/contracts/:address/prepare-tx/:functionName
 */
router.post('/:address/prepare-tx/:functionName', async (req, res, next) => {
  try {
    const { address, functionName } = req.params;
    const { chainId } = req.query;
    const { args, value } = req.body;
    
    if (!address || !functionName) {
      throw new AppError('Contract address and function name are required', 400);
    }
    
    logger.info(`Preparing transaction for contract function: ${functionName}`, { 
      address, 
      chainId, 
      args 
    });
    
    // In a real implementation, this would prepare transaction data
    // For now, we'll just return a mock response
    const mockTxData = {
      to: address,
      data: `0x${Buffer.from(`${functionName}(${args.join(',')})`, 'utf8').toString('hex')}`,
      value: value || '0x0',
      chainId: chainId || '1'
    };
    
    res.status(200).json({
      success: true,
      data: {
        txData: mockTxData,
        functionName,
        args
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
