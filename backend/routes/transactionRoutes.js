const express = require('express');
const router = express.Router();
const transactionController = require('../controller/transactionController');
const { validateTransaction } = require('../middleware/validator');

router.get('/', transactionController.getAll);
router.post('/', validateTransaction, transactionController.create);
router.post('/sync', transactionController.syncBatch);
router.get('/:id', transactionController.getById);
router.put('/:id', validateTransaction, transactionController.update);
router.delete('/:id', transactionController.delete);

module.exports = router;
