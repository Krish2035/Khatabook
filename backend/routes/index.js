const express = require('express');
const router = express.Router();

const transactionRoutes = require('./transactionRoutes');
const analyticsRoutes = require('./analyticsRoutes');
const healthRoutes = require('./healthRoutes');

router.use('/transactions', transactionRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/health', healthRoutes);

module.exports = router;
