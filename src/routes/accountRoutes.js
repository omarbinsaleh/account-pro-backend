const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController.js');

// Define account related routes
router.post('/', accountController.createAccount);

//export the router to be used in the main application
module.exports = router;