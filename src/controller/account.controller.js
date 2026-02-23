const accountModel = require('../models/account.model');

async function createAccountController(req, res) {
    const user = req.user;

    try {
        const account = await accountModel.create({
            user: user._id,
        })

        res.status(201).json({
            account
        })
    } catch (error) {
        console.error('Error creating account:', error);
        res.status(500).json({
            message: 'An error occurred while creating the account. Please try again later.'
        })
    }
}

module.exports = {
    createAccountController
}