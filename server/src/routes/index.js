const express = require('express');
const { apiKeyAuth } = require('../middleware/apiKeyAuth');
const contractRoutes = require('./contracts');
const transactionRoutes = require('./transactions');

const router = express.Router();

// Basic health check route (no auth required)
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Protected routes requiring API key
router.use('/contracts', apiKeyAuth, contractRoutes);
router.use('/transactions', apiKeyAuth, transactionRoutes);

module.exports = router;
