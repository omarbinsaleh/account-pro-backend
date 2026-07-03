// Import necessary modules
const express = require('express');
const companyControllers = require('../controllers/companyController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

// Define the company router
const companyRouter = express.Router();

// Define the API endpoints for company operations with appropriate HTTP methods, paths, and middleware for authentication
companyRouter.post('/', authMiddleware.authUser, companyControllers.createCompany); // API to register a new company -> Done
companyRouter.get('/:id', authMiddleware.authUser, companyControllers.findCompanyById); // API to find a company by its ID -> Done
companyRouter.get('/', authMiddleware.authUser, companyControllers.findCompanies); // API end point to find more than one company -> Done
companyRouter.patch('/:id', authMiddleware.authUser, companyControllers.updateCompanyById); // API end point to update a company by its ID -> Done
companyRouter.delete('/:id', authMiddleware.authUser, companyControllers.deleteCompanyById); // API end point to delete a company by its ID

// Export the company router
module.exports = companyRouter;