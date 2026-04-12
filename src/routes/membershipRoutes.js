// Import necessary dependencies
const express = require('express');
const membershipController = require('../controllers/membershipController');
const authMiddleware = require('../middlewares/authMiddleware');

// Initialize the Router
const membershipRouter = express.Router();

// Define the membership routes
membershipRouter.post('/', authMiddleware.authUser, authMiddleware.authCompany, membershipController.createMembership);
membershipRouter.get('/', authMiddleware.authUser, authMiddleware.authCompany, membershipController.findMemberships);
membershipRouter.get('/:id', authMiddleware.authUser, authMiddleware.authCompany, membershipController.findMembershipById);
membershipRouter.patch('/:id', authMiddleware.authUser, authMiddleware.authCompany, membershipController.updateMembershipById);
membershipRouter.delete('/:id', authMiddleware.authUser, authMiddleware.authCompany, membershipController.deleteMembershipById);

// Exports the membership router
module.exports = membershipRouter;