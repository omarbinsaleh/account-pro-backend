const Account = require('../models/Account.js');
const mongoose = require('mongoose');

// @name: createAccount
// @route: POST /api/accounts
// @desc: Create a new account
// @access: Private
const createAccount = async (req, res) => {
   try {
      // extract the account details from the request body
      const code = req.body.code;
      const name = req.body.name;
      const type = req.body.type;
      const parentAccount = req.body.parentAccount || null;

      // validate the account details comming from the request body
     if (!code || typeof code !== 'string' || !code.trim().length) {
      return res.status(400).json({success: false, message: 'Invalid or missing account code', data: null});
     };

     if (!name || typeof name !== 'string' || !name.trim().length) {
      return res.status(400).json({success: false, message: 'Invalid or missing account name', data: null});
     };

     if (!type || typeof type !== 'string' || !type.trim().length || !['asset', 'liability', 'equity', 'income', 'expense'].includes(type.toLowerCase())) {
      return res.status(400).json({success: false, message: 'Invalid or missing account type', data: null});
     };

     if (parentAccount && !mongoose.Types.ObjectId.isValid(parentAccount)) {
      return res.status(400).json({success: false, message: 'Invalid parent account ID', data: null});
     };

      // create a new account using the Account model
      const newAccount = await Account.create({code, name, type, parentAccount});

      // send the created account as response
      return res.status(201).json({success: true, data: newAccount, message: 'Account created successfully'});
   } catch (error) {
      return res.status(500).json({success: false, message: 'Server error while creating account', data: null});
   };
};



// export the controller functions
module.exports = { createAccount };