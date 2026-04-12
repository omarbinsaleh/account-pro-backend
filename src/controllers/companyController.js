// Import necessary dependencies
const mongoose = require('mongoose');
const User = require('../models/User');
const Company = require('../models/Company');
const Memebership = require('../models/Membership');

// Define the company controller object
const companyController = {};

// @name: createCompany
// @path: POST /api/companies
// @access: Private
// @middleware: authUser
// @description: Create a new company
companyController.createCompany = async (req, res) => {};

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