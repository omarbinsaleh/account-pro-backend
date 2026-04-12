// Import necessary module
const mongoose = require('mongoose');

// Define the company schema
const companySchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
   },
   email: {
      type: String,
      required: [true, 'Company email is required'],
      minlength: [5, 'Email must be at least 5 characters long'],
      unique: [true, 'Company with this email already exists'],
      trim: true,
      lowercase: true,
      match: [/\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please use a valid email address.']
   },
   phone: {
      type: String,
      required: [true, 'Company phone number is required'],
      match: [/^\+?[1-9]\d{1,14}$/, 'Please use a valid phone number'],
   },
   address: {
      type: String,
      required: [true, 'Company address is required'],
      trim: true,
   },
   website: String,
   description: String,
   logo: String,
   currency: {
      type: String,
      trim: true,
      minlength: [3, 'Currency must be at least 3 characters long'],
      maxlength: [3, 'Currency must be at most 3 characters long'],
      uppercase: true,
      default: 'USD',
   },
   owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner Id is required']
   }
}, { timestamps: true });

// Define the Company Model
const Company = mongoose.model('Company', companySchema);

// exports the company model
module.exports = Company;