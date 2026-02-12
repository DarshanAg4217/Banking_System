const express = require('express');
const authController = require('../controller/auth.controller');


const router = express.Router();


/** * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */

router.post('/register', authController.userRegisterController);
router.post('/login', authController.userLoginController);


module.exports = router;