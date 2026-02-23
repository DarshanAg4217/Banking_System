const express = require('express');
const cookieParser = require('cookie-parser');

/* routes */
const authRoutes = require('./routes/auth.route');
const accountRouter = require('../src/routes/account.routes');

const app = express()

app.use(express.json());
app.use(cookieParser());




/* use routes */
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRouter);




module.exports = app;