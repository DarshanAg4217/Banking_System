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


async function getUserAccountsController(req, res) {

    const accounts = await accountModel.find({
        user: req.user._id
    })

    res.status(200).json({
        accounts
    })
}

async function getAccountBalanceController(req, res) {
    const { accountId } = req.params
    const account = await accountModel.findById({
        _id: accountId,
        user: req.user._id
    })

    if (!account) {
        return res.status(404).json({
            message: "Account not found"
        })
    }

    const balance = await account.getBalance()

    res.status(200).json({
        account: account._id,
        balance: balance
    })
}

module.exports = {
    createAccountController,
    getUserAccountsController,
    getAccountBalanceController
}