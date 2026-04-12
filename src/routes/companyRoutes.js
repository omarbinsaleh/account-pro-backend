// Import necessary modules
const express = require('express');
const companyControllers = require('../controllers/companyController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

// Define the company router
const companyRouter = express.Router();

companyRouter.post('/', authMiddleware.authUser, companyControllers.createCompany);
companyRouter.get('/:id', authMiddleware.authUser, companyControllers.findCompanyById);
companyRouter.get('/', authMiddleware.authUser, companyControllers.findCompanies);
companyRouter.patch('/:id', authMiddleware.authUser, companyControllers.updateCompanyById);
companyRouter.delete('/:id', authMiddleware.authUser, companyControllers.deleteCompanyById);


// Export the company router
module.exports = companyRouter;