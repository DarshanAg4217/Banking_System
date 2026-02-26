require('dotenv').config();

const mongoose = require('mongoose');
const connectToDB = require('../src/db/db');
const userModel = require('../src/models/user.model');
const accountModel = require('../src/models/account.model');
const transactionController = require('../src/controller/transaction.controller');
const emailService = require('../src/services/email.service');

async function main() {
  // Stub email sending to avoid external side effects during this test
  emailService.sendTransactionEmail = async () => {};
  emailService.sendRegistrationEmail = async () => {};
  emailService.sendLoginEmail = async () => {};

  await connectToDB();

  const systemUser = await userModel.findOne({ email: 'system@bank.com' });
  const toUser = await userModel.findOne({ email: 'user1@bank.com' });

  if (!systemUser || !toUser) {
    console.error('Required users not found. Seed users before running this script.');
    process.exit(1);
  }

  const systemAccount = await accountModel.findOne({ user: systemUser._id });
  const toAccount = await accountModel.findOne({ user: toUser._id });

  if (!systemAccount || !toAccount) {
    console.error('Required accounts not found. Seed accounts before running this script.');
    process.exit(1);
  }

  function makeRes(label) {
    return {
      statusCode: 200,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.body = payload;
        console.log(
          label +
            ':' +
            JSON.stringify({
              statusCode: this.statusCode,
              body: payload,
            })
        );
        return this;
      },
    };
  }

  // Test initial-funds flow
  await transactionController.createInitialFundsTransaction(
    {
      body: {
        toAccount: toAccount._id,
        amount: 1000,
        idempotencyKey: 'init-funds-1',
      },
      user: systemUser,
    },
    makeRes('initialFunds')
  );

  // Test standard transaction flow
  await transactionController.createTransaction(
    {
      body: {
        fromAccount: systemAccount._id,
        toAccount: toAccount._id,
        amount: 500,
        idempotencyKey: 'std-txn-1',
      },
      user: {
        email: systemUser.email,
        name: systemUser.name,
      },
    },
    makeRes('standardTxn')
  );

  await mongoose.connection.close();
}

main().catch((err) => {
  console.error('SCRIPT_ERROR', err);
  process.exit(1);
});

