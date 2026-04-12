// Import the necessary module
const mongoose = require('mongoose');

// Define the Account Schema with fields: code, name, type (with enum validation), and parentAccount (referencing another Account)
const accountSchema = new mongoose.Schema({
   companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company reference is required for the account'],
   },
   code: {
      type: String,
      trim: true,
      unique: [true, 'Account code must be unique'],
      required: [true, 'Account code is required']
   },
   name: {
      type: String,
      trim: true,
      required: [true, 'Account name is required'],
   },
   type: {
      type: String,
      required: [true, 'Account type is required'],
      enum: {
         values: ['Asset', 'Liability', 'Equity', 'Income', 'Expense'],
         message: '{VALUE} is not a valid account type.'
      },
      trim: true,
   },
   isGroup: {
      type: Boolean,
      default: false,
      description: 'Indicates whether this account is a group account (can have child accounts) or a leaf account (cannot have child accounts).'
   },
   isSystem: {
      type: Boolean,
      default: false,
      description: "If true, this account is required by the system and cannot be deleted by the user."
   },
   parentAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      default: null
   },
   status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
      trim: true,
   }
}, { timestamps: true });

// A. Compound Index: Code must be unique within a single company
// This allows different companies to use the same codes (e.g., "1000")
accountSchema.index({ code: 1, company: 1 }, { unique: true });

// Safety Hook: Prevent an account from being its own parent
accountSchema.pre('save', function(next) {
   if (this.parentAccount && this.parentAccount.equals(this._id)) {
      throw new Error('An account cannot be its own parent.');
   }
});

// Create the Account model using the defined schema
const Account = mongoose.model('Account', accountSchema);

// Export the Account model for use in other parts of the application
module.exports = Account;