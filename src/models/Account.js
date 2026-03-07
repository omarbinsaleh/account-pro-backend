// Import the necessary module
const mongoose = require('mongoose');

// Define the Account Schema with fields: code, name, type (with enum validation), and parentAccount (referencing another Account)
const accountSchema = new mongoose.Schema({
   code: String,
   name: String,
   type: {
      type: String,
      enum: ['Asset', 'Liability', 'Equity', 'Income', 'Expense']
   },
   parentAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      default: null
   },
});

// Create the Account model using the defined schema
const Account = mongoose.model('Account', accountSchema);

// Export the Account model for use in other parts of the application
module.exports = Account;