// Import necessary dependencies
const mongoose = require('mongoose');
const Membership = require('../models/Membership');
const User = require('../models/User');

// Define the controller object
const membershipController = {};

// @name: createMembership
// @path: POST /api/memberships
// @access: Private
// @middleware: authUser -> authCompany
// @description: Create a membership
membershipController.createMembership = async (req, res) => {};

// @name: findMembershipById
// @path: GET /api/memberships/:id
// @access: Private
// @middleware: authUser -> authCompany
// @description: Find a membership by
membershipController.findMembershipById = async (req, res) => {};

// @name: findMemberships
// @path: GET /api/memberships
// @access: Private
// @middleware: authUser -> authCompany
// @description: Find many memberships
membershipController.findMemberships = async (req, res) => {};

// @name: updateMembershipById
// @path: PATCH /api/memberships/:id
// @access: Private
// @middleware: authUser -> authCompany
// @description: Update a membership document by it's ID
membershipController.updateMembershipById = async (req, res) => {};

// @name: deleteMembershipById
// @path: DELETE /api/membership/:id
// @access: Private
// @middleware: authUser -> authCompany
// @description: Delete a membership document by it's ID
membershipController.deleteMembershipById = async (req, res) => {};

// Export the memebershipController
module.exports = membershipController;