const express = require('express');
const router = express.Router();

const transactionRoutes = require('./transactionRoutes');
const analyticsRoutes = require('./analyticsRoutes');
const healthRoutes = require('./healthRoutes');
const authRoutes = require('./authRoutes');

router.use('/transactions', transactionRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);

module.exports = router;
