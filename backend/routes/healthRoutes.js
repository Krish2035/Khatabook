const express = require('express');
const router = express.Router();
const healthController = require('../controller/healthController');

router.get('/', healthController.check);

module.exports = router;
