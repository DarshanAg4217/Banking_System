const express = require('express');
const cookieParser = require('cookie-parser');

/* routes */
const authRoutes = require('./routes/auth.route');
const accountRouter = require('../src/routes/account.routes');
const transactionRoutes = require('../src/routes/transaction.route')

const app = express()

app.use(express.json());
app.use(cookieParser());




/* use routes */
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRouter);
app.use("/api/transactions", transactionRoutes)




module.exports = app;