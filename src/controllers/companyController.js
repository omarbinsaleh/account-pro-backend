// Import necessary dependencies
const mongoose = require('mongoose');
const User = require('../models/User');
const Company = require('../models/Company');
const Membership = require('../models/Membership');

// Define the company controller object
const companyController = {};

// @name: createCompany
// @path: POST /api/companies
// @access: Private
// @middleware: authUser
// @description: Create a new company
companyController.createCompany = async (req, res) => {
   try {
      // Step 01: Get the user ID from the request object
      const userId = req.user?._id;
      if (!userId || !mongoose.isValidObjectId(userId)) {
         return res.status(400).json({ success: false, message: 'Missing or invalid user ID', data: null });
      };

      // Step 02: Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
         return res.status(404).json({ success: false, message: 'User not found', data: null });
      };

      // Step 03: Extract company details from the request body
      const { name, email, phone, address, website, description, logo, currency } = req.body;

      // Step 04: Validate the required fields
      if (!name || typeof name !== 'string' || !name.trim().length) {
         return res.status(400).json({ success: false, message: 'Company name is required and must be a non-empty string', data: null });
      };

      // Step 05: Validate the email field
      if (!email || typeof email !== 'string' || !email.trim().length < 5 || !email.includes('@')) {
         return res.status(400).json({ success: false, message: 'Company email is required and must be a valid email address', data: null });
      };

      // Step 06: Validate the phone number field
      if (!phone || typeof phone !== 'string' || !phone.trim().length) {
         return res.status(400).json({ success: false, message: 'Company phone number is required and must be a valid phone number', data: null });
      };

      // Step 07: Validate the address field
      if (!address || typeof address !== 'string' || !address.trim().length) {
         return res.status(400).json({ success: false, message: 'Company address is required and must be a non-empty string', data: null });
      };

      // Step 08: Create a new company document
      const newCompany = new Company({
         name,
         email,
         phone,
         address,
         website,
         description,
         currency,
         owner: userId,
         logo
      });

      // Step 09: Create a new membership document for the company owner
      const newMembership = await Membership.create({
         userId,
         companyId: newCompany._id,
         role: 'owner'
      });

      // Step 10: Save the new company document to the database
      await newCompany.save();

      // Step 11: Return a success response with the created company data
      return res.status(201).json({ success: true, message: 'Company created successfully', data: newCompany });
   } catch (error) {
      return res.status(500).json({ success: false, message: 'An error occurred while creating the company, please try again later', data: null });
   };
};

// @name: findCompanyById 
// @path: GET /api/companies/:id
// @access: Private
// @middleware: authUser
// @description: Find a company by it's ID
companyController.findCompanyById = async (req, res) => {};

// @name: findCompanies 
// @path: GET /api/companies
// @access: Private
// @middleware: authUser
// @description: Find many companies
companyController.findCompanies = async (req, res) => {};

// @name: updateCompanyById
// @path: PATCH /api/companies/:id
// @access: Private
// @middleware: authUser
// @description: Update a company information by it's ID
companyController.updateCompanyById = async (req, res) => {};

// @name: deleteCompanyById
// @path: DELETE /api/companies/:id
// @access: Private
// @middleware: authUser
// @description: Delete a company by it's ID
companyController.deleteCompanyById = async (req, res) => {};

// Export the company controller
module.exports = companyController;