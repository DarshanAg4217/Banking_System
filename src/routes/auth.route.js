const express = require('express');
const authController = require('../controller/auth.controller');


const router = express.Router();


/** * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */

router.post('/register', authController.userRegisterController);

/** * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
router.post('/login', authController.userLoginController);

/** * @route POST /api/auth/logout
 * @desc Logout a user
 * @access Private
 */
router.post('/logout', authController.userLogoutController);

module.exports = router;