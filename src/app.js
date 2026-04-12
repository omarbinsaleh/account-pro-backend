// import dependencies
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const connectToDatabase = require('./db/db');
const accountRoutes = require('./routes/accountRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const companyRoutes = require('./routes/companyRoutes.js');
const membershipRoutes = require('./routes/membershipRoutes.js');

const app = express();

// application level middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// connect to the database
connectToDatabase();

// API routes
app.use('/api/users', userRoutes)
app.use('/api/companies', companyRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/accounts', accountRoutes);

// export the app
module.exports = app;