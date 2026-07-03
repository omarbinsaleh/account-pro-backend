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
companySchema.statics.validateCompanyData = function (data = {}) {
   if (!data || typeof data !== 'object' || Array.isArray(data) || !Object.keys(data).length) {
      return { success: false, message: 'Invalid Company data.', data: null };
   };

   const validatedData = {};

   const { name, email, phone, address, website, description, logo, currency, owner } = data;
   if (name) {
      if (typeof name !== 'string' || !name.trim().length || name.length > 100) {
         return { success: false, message: 'Invalid Company name.', data: null };
      };

      validatedData.name = name;
   }

   if (email) {
      const emailValidationResult = utilities.validateEmail(email);
      const isEmailValid = emailValidationResult.success;
      if (!isEmailValid) {
         return { success: false, message: emailValidationResult.message, data: null };
      };

      validatedData.email = email;
   };

   if (phone) {
      if (typeof phone !== 'object' || !Object.keys(phone).length < 2) {
         return { success: false, message: 'Invalid Comppany Phone Number Data.', data: null };
      };

      const number = ( typeof phone.number === 'string' && phone.number.trim().length) ? phone.number.trim() : '';
      const countryCode = ( typeof phone.country === 'string' && phone.country.trim().length) ? phone.country.trim() : '';
      const phoneValidationResult = utilities.validatePhoneNumber(number, country);
      const isPhoneValid = phoneValidationResult.isValid;
      if (!isPhoneValid) {
         return { success: false, message: `Invalid Company Phone Number: ${phoneValidationResult.error}`, data: null };
      };

      validatedData.phone = phoneValidationResult.formatted;
   };

   if (address) {
      if (typeof address !== 'string') {
         return { success: false, message: 'Invalid Company address.', data: null };
      };

      validatedData.address = address;
   };

   if (website) {
      const urlValidationResult = utilities.validateURL(website);
      const isURLValid = urlValidationResult.success;
      if (!isURLValid) {
         return { success: false, message: urlValidationResult.message, data: null };
      };

      validatedData.website = website;
   };

   if (description) {
      if (typeof description !== 'string') {
         return { success: false, message: 'Invalid Company description.', data: null }
      };
      
      validatedData.description = description;
   };

   if (logo) {
      if (typeof logo !== 'string' || !logo.trim().length) {
         return { success: false, message: 'Invalid Company logo.', data: null };
      };

      validatedData.logo = logo;
   };

   if (currency) {
      if (typeof currency !== 'string' || !currency.trim().length || currency.trim().length !== 3) {
         return { success: false, message: 'Invalid Company currency.', data: null };
      };

      validatedData.currency = currency;
   };

   if (owner) {
      if (typeof owner !== 'string' || !owner.trim().length || !mongoose.isValidObjectId(owner)) {
         return { success: false, message: 'Invalid Company owner ID.', data: null };
      }
      validatedData.owner = owner;
   };

   if (!Object.keys(validatedData)) {
      return { success: false, message: 'No valid data for company found in the payload', data: null };
   };

   return { success: true, message: 'Valid company data.', data: validatedData };
};

// Define the Company Model
const Company = mongoose.model('Company', companySchema);

// exports the company model
module.exports = Company;