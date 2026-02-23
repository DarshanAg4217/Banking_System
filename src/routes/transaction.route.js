const express = require('express');
const transactionController = require('../controller/transaction.controller');
const authMiddleware = require('../middleware/auth.middleware');

const transactionRoutes = express.Router();

/** * @route POST /api/transactions
 * @desc Create a new transaction
 * @access Private
 */

transactionRoutes.post('/', authMiddleware.authMiddleware, transactionController.createTransaction);


module.exports = transactionRoutes;