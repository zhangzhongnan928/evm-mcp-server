const express = require('express');
const { AppError } = require('../middleware/errorHandler');
const { setupLogging } = require('../utils/logger');
const { getTransactionReceipt, getTransactionStatus, estimateGas } = require('../services/transactionService');

const router = express.Router();
const logger = setupLogging();

/**
 * Get transaction receipt
 * GET /api/transactions/:txHash
 */
router.get('/:txHash', async (req, res, next) => {
  try {
    const { txHash } = req.params;
    const { chainId } = req.query;
    
    if (!txHash) {
      throw new AppError('Transaction hash is required', 400);
    }
    
    const receipt = await getTransactionReceipt(txHash, chainId);
    
    res.status(200).json({
      success: true,
      data: receipt
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get transaction status
 * GET /api/transactions/:txHash/status
 */
router.get('/:txHash/status', async (req, res, next) => {
  try {
    const { txHash } = req.params;
    const { chainId } = req.query;
    
    if (!txHash) {
      throw new AppError('Transaction hash is required', 400);
    }
    
    const status = await getTransactionStatus(txHash, chainId);
    
    res.status(200).json({
      success: true,
      data: status
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Estimate gas for a transaction
 * POST /api/transactions/estimate-gas
 */
router.post('/estimate-gas', async (req, res, next) => {
  try {
    const { to, data, value, from, chainId } = req.body;
    
    if (!to || !data) {
      throw new AppError('Transaction recipient and data are required', 400);
    }
    
    const gasEstimate = await estimateGas({
      to,
      data,
      value: value || '0x0',
      from: from || null
    }, chainId);
    
    res.status(200).json({
      success: true,
      data: {
        gasEstimate,
        tx: {
          to,
          data,
          value: value || '0x0'
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
