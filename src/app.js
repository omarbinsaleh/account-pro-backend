// import dependencies
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const connectToDatabase = require('./db/db');

const app = express();

// application level middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// connect to the database
connectToDatabase();

// API routes

// export the app
module.exports = app;