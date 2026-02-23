const express = require('express');
const { createAccountController } = require('../controller/account.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router()

/** 
 -* create account 
*/

router.post('/', authMiddleware.authMiddleware, createAccountController);



module.exports = router;