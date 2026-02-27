const express = require('express');
const { createAccountController, getUserAccountsController, getAccountBalanceController } = require('../controller/account.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router()

/** 
 -* create account 
*/

router.post('/', authMiddleware.authMiddleware, createAccountController);


/** 
 * - GET /api/accounts/
 * - Get all accounts of the logged-in user
 * - Protected Route
 */

router.get('/', authMiddleware.authMiddleware, getUserAccountsController);

/** 
 * - GET /api/accounts/balance/:accountId
 * - Get the balance of a specific account
 * - Protected Route
 */

router.get('/balance/:accountId', authMiddleware.authMiddleware, getAccountBalanceController);


module.exports = router;