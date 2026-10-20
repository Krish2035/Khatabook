const express = require('express');
const router = express.Router();
const analyticsController = require('../controller/analyticsController');
const { validateMonthlyQuery, validateCompareQuery } = require('../middleware/validator');

router.get('/monthly-summary', validateMonthlyQuery, analyticsController.getMonthlySummary);
router.get('/compare', validateCompareQuery, analyticsController.compareMonths);

module.exports = router;
