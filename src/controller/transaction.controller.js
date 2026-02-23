const transactionModel = require('../models/transaction.model');
const ledgerModel = require('../models/ledger.model');
const accountModel = require('../models/account.model');
const mongoose = require('mongoose');

const emailService = require('../services/email.service');

/**
 * -create new transaction
 * -The 10- Step process of creating a transaction:
     * 1. validate request
     * 2. validate idempotency key
     * 3. check account status
     * 4. check sufficient balance in sender's account
     * 5. create transaction {PENDING}
     * 6. create ledger entry for sender (debit)
     * 7. create ledger entry for receiver (credit)
     * 8. update transaction {COMPLETED}
     * 9. commit MONGO DB transaction session
     * 10. send email notification to sender and receiver
 */


async function createTransaction(req, res) {


    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

    /**
     * 1. validate request
     */

    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const fromUserAccount = await accountModel.findOne({
        _id: fromAccount,
    });

    const toUserAccount = await accountModel.findOne({
        _id: toAccount,
    });

    if (!fromUserAccount || !toUserAccount) {
        return res.status(404).json({ message: 'One or both accounts not found' });
    }


    /**
     * 2. validate idempotency key
     */

    const istransactionKeyAlreadyExists = await transactionModel.findOne({ idempotencyKey: idempotencyKey });

    if (istransactionKeyAlreadyExists) {

        if (istransactionKeyAlreadyExists.status === 'COMPLETED') {
            return res.status(400).json({
                message: 'Transaction with this idempotency key already exists and is completed',
                transaction: istransactionKeyAlreadyExists
            });
        }

        if (istransactionKeyAlreadyExists.status === 'PENDING') {
            return res.status(400).json({
                message: 'Transaction with this idempotency key already exists and is pending',
                transaction: istransactionKeyAlreadyExists

            });
        }

        if (istransactionKeyAlreadyExists.status === 'FAILED') {
            return res.status(400).json({
                message: 'Previous Transaction attempt failed, please try again.',
                transaction: istransactionKeyAlreadyExists
            });
        }

        if (istransactionKeyAlreadyExists.status === 'REVERSED') {
            return res.status(400).json({
                message: 'Previous Transaction attempt was reversed, please try again.',
                transaction: istransactionKeyAlreadyExists
            });
        }

    }

    /**
     * 3. check account status
     */

    if (fromUserAccount.status !== 'ACTIVE' || toUserAccount.status !== 'ACTIVE') {
        return res.status(400).json({ message: 'One or both accounts are not active' });
    }

    /**
     * 4. check sufficient balance in sender's account
     * */

    const balance = await fromUserAccount.getBalance();

    if (balance < amount) {
        return res.status(400).json({
            message: `Insufficient balance in sender's account. Current balance is ${balance}, Requested ammount is ${amount}`
        });
    }

    /**
     * 5. create transaction {PENDING}
     * */

    const session = await mongoose.startSession();
    session.startTransaction();



    const transaction = await transactionModel.create([{
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status: 'PENDING'
    }], { session });

    /**
     * 6. create ledger entry for sender (debit)
     */

    const debitLedgerEntry = await ledgerEntryModel.create({
        account: fromAccount,
        amount,
        transaction: transaction._id,
        type: 'DEBIT'
    }, { session });

    /**
     * 7. create ledger entry for receiver (credit)
     */

    const creaditLedgerEntry = await ledgerEntryModel.create({
        account: toAccount,
        amount,
        transaction: transaction._id,
        type: 'CREDIT'
    }, { session })


    /**
     * 8. update transaction {COMPLETED}
     */
    transaction.status = 'COMPLETED';

    /**
     * 9. commit MONGO DB transaction session
     */
    await transaction.save({ session });

    await session.commitTransaction();
    session.endSession();


    /**
     * 10. send email notification to sender and receiver
     */

    await emailService.sendTransactionEmail(fromUserAccount.user, toUserAccount.user, amount);

    res.status(201).json({
        message: 'Transaction completed successfully',
        transaction: transaction
    })


}

module.exports = {
    createTransaction
}