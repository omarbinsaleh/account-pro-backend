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
   // Step 01: Get the user ID from the request object
   const userId = req.user?._id;
   if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: 'Missing or invalid user ID', data: null });
   };

   // Step 02: Extract company details from the request body
   const { name, email, phone, address, website, description, logo, currency } = req.body;

   // Step 03: Validate the required fields
   if (!name || typeof name !== 'string' || !name.trim().length) {
      return res.status(400).json({ success: false, message: 'Company name is required and must be a non-empty string', data: null });
   };

   // Step 04: Validate the email field
   if (!email || typeof email !== 'string' || !email.trim().length < 5 || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Company email is required and must be a valid email address', data: null });
   };

   // Step 05: Validate the phone number field
   if (!phone || typeof phone !== 'string' || !phone.trim().length) {
      return res.status(400).json({ success: false, message: 'Company phone number is required and must be a valid phone number', data: null });
   };

   // Step 06: Validate the address field
   if (!address || typeof address !== 'string' || !address.trim().length) {
      return res.status(400).json({ success: false, message: 'Company address is required and must be a non-empty string', data: null });
   };

   // Step 07: Start a new session for the transaction to ensure atomicity of the company creattion and membership creation operations
   const session = await mongoose.startSession();

   try {
      // Step 08: Check if the Company email already exists
      const existingCompany = await Company.findOne({ email: email.trim().toLowerCase() });
      if (existingCompany) {
         session.endSession();
         return res.status(400).json({ success: false, message: 'A company with this email already exists', data: null });
      };

      // Step 09: Start the transaction for creating the company and the membership
      session.startTransaction();

      // Step 10: Create a new company document
      const companyArray = await Company.create([{
         name,
         email,
         phone,
         address,
         website,
         description,
         currency,
         owner: userId,
         logo
      }], { session });
      const newCompany = companyArray[0];

      // Step 11: Create a new membership document for the company owner
      await Membership.create([{
         userId,
         companyId: newCompany._id,
         role: 'owner'
      }], { session });

      // Step 12: Commit the transaction and end the session
      await session.commitTransaction();
      await session.endSession();

      // Step 13: Return a success response with the created company data
      return res.status(201).json({ success: true, message: 'Company created successfully', data: newCompany });
   } catch (error) {
      // Step 14: Rollback the transaction
      if (session.inTransaction()) {
         await session.abortTransaction();
      }

      // Step 15: End the session
      await session.endSession();

      // Step 16: Return an error response with a generic message to avoid exposing sensitive error details
      return res.status(500).json({ success: false, message: 'An error occurred while creating the company, please try again later', data: null });
   }
};

// @name: findCompanyById 
// @path: GET /api/companies/:id
// @access: Private
// @middleware: authUser
// @description: Find a company by it's ID
companyController.findCompanyById = async (req, res) => {
   // Step 01: Check if the user is authenticated and the user information is available in the request object (set by authUser middleware);
   const user = req.user;
   if (!user || !user._id || !mongoose.isValidObjectId(user._id)) {
      return res.status(401).json({ success: false, message: 'User not authenticated', data: null });
   };

   // Step 02: Get the company ID from the request parameters
   const companyId = req.params?.id;
   if (!companyId || !mongoose.isValidObjectId(companyId)) {
      return res.status(400).json({ success: false, message: 'Invalid or missing company ID', data: null });
   };


   try {
      // Step 03: Check Membership Authorization: Ensure that the authenticated user is a member of the company they are trying to access
      const membership = await Membership.findOne({ userId: user._id, companyId }).populate('companyId');
      if (!membership) {
         return res.status(403).json({ success: false, message: 'Access denied: You are not authorized to access this company', data: null });
      };

      // Step 04: Return a success response with the found company data
      return res.status(200).json({ success: true, message: 'Company found successfully', data: { ...membership.companyId.toObject(), userRole: membership.role } });
   } catch (error) {
      // Step 05: Return an error response with a generic message to avoid exposing sensitive error details
      return res.status(500).json({ success: false, message: 'Error occurred while finding the company, please try again later', data: null });
   };
};

// @name: findCompanies 
// @path: GET /api/companies
// @access: Private
// @middleware: authUser
// @description: Find many companies
companyController.findCompanies = async (req, res) => {
   // Step 01: Check if the user is authenticated and the user information is available in the request object (set by authUser middleware)
   const user = req.user;
   if (!user || !user._id || !mongoose.isValidObjectId(user._id)) {
      return res.status(401).json({ success: false, message: 'User not authenticated', data: [] });
   };

   // Step 02: Get the query parameters for pagination and filtering
   const page = parseInt(req.query?.page) || 1;
   const limit = parseInt(req.query?.limit) || 10;
   const skip = (page - 1) * limit;

   try {
      // Step 03: Prepare a pagination metadata object to include in the response
      const totalCompanies = await Membership.countDocuments({ userId: user._id });
      const totalPages = Math.ceil(totalCompanies / limit);
      const pagination = {
         totalCompanies,
         totalPages,
         currentPage: page,
         nextPage: page < totalPages ? page + 1 : null,
         prevPage: page > 1 ? page - 1 : null
      };

      // Step 04: Check if any companies were found and if not, return a 200 response
      if (!totalCompanies) {
         return res.status(200).json({ success: true, message: 'No companies found for this user', data: [], pagination });
      };

      // Step 05: Find the companies that the authenticated user is a member of, with pagination and filtering
      const memberships = await Membership.find({ userId: user._id }).populate('companyId').skip(skip).limit(limit);
      const companies = memberships.filter(membership => membership.companyId).map(membership => {
         return { ...membership.companyId.toObject(), userRole: membership.role };
      });

      // Step 06: Check if any companies were found and if not, return a 200 response
      if (!companies.length) {
         return res.status(200).json({ success: true, message: 'No companies found for this user on this page', data: [], pagination });
      };

      // Step 07: Return a success response with the found companies data
      return res.status(200).json({ success: true, message: 'Companies found successfully', data: companies, pagination });

   } catch (error) {
      // Step 08: Return an error response with a generic message to avoid exposing sensitive error details
      return res.status(500).json({ success: false, message: 'Error occurred while finding the companies, please try again later', data: [] });
   }
};

// @name: updateCompanyById
// @path: PATCH /api/companies/:id
// @access: Private
// @middleware: authUser
// @description: Update a company information by it's ID
companyController.updateCompanyById = async (req, res) => { };

// @name: deleteCompanyById
// @path: DELETE /api/companies/:id
// @access: Private
// @middleware: authUser
// @description: Delete a company by it's ID
companyController.deleteCompanyById = async (req, res) => { };

// Export the company controller
module.exports = companyController;