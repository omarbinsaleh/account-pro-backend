// Import necessary module
const mongoose = require('mongoose');
const utilities = require('../utilities');

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

// Static method to validate company data
companySchema.statics.validateCompanyData = function (data) {
   if (!data || typeof data !== 'object' || Array.isArray(data) || !Object.keys(data).length) {
      return { success: false, message: 'Invalid Company data.' };
   };

   const { name, email, phone, address, website, description, logo, currency, owner } = data;
   if (name && (typeof name !== 'string' || !name.trim().length || name.length > 100)) {
      return { success: false, message: 'Invalid Company name.' };
   }

   if (email) {
      const emailValidationResult = utilities.validateEmail(email);
      const isEmailValid = emailValidationResult.success;
      if (!isEmailValid) return { success: false, message: emailValidationResult.message };
   };

   if (phone && (typeof phone !== 'string' || !phone.trim().length || phone.length > 20)) {
      return { success: false, message: 'Invalid Comppany phone number.' };
   };

   if (address && (typeof address !== 'string' || !address.trim().length)) {
      return { success: false, message: 'Invalid Company address.' };
   };

   if (website) {
      const urlValidationResult = utilities.validateURL(website);
      const isURLValid = urlValidationResult.success;
      if (!isURLValid) {
         return { success: false, message: urlValidationResult.message };
      };
   };

   if (description && (typeof description !== 'string' )) {
      return { success: false, message: 'Invalid Company description.' }
   };

   if (logo && (typeof logo !== 'string' || !logo.trim().length)) {
      return { success: false, message: 'Invalid Company logo.' };
   };

   if (currency && (typeof currency !== 'string' || !currency.trim().length || currency.length !== 3)) {
      return { success: false, message: 'Invalid Company currency.' };
   };

   if (owner && (typeof owner !== 'string' || !owner.trim().length || !mongoose.isValidObjectId(owner))) {
      return { success: false, message: 'Invalid Company owner ID.' };
   };

   return { success: true, message: 'Valid company data.', data };
};

// Define the Company Model
const Company = mongoose.model('Company', companySchema);

// exports the company model
module.exports = Company;