// import necessay modules
const mongoose = require('mongoose');
const User = require('../models/User');
const Company = require('../models/Company');
const Membership = require('../models/Membership');

// define authentication middleware function object
const authMiddleware = {};

// define authUser middleware function to authenticate user using JWT token
authMiddleware.authUser = async (req, res, next) => {
   try {
      // Step-01: Extract the authentication token from the cookies or headers
      // and check if token is not provided
      const authHeader = req.header('Authorization');
      const token = req.cookies.token || (authHeader?.startWith('Bearer ') ? authHeader?.split(' ')[1] : null);
      if (!token) {
         return res.status(401).json({ success: false, message: 'Authentication token is missing', data: null });
      };

      // Step-02: Verify the token
      const decoded = User.validateAuthToken(token);
      if (!decoded) {
         return res.status(401).json({ success: false, message: 'Invalid or expired authentication token', data: null });
      };

      // Step-03: Find the user by id from the decoded token
      const user = await User.findById(decoded.id);
      if (!user) {
         return res.status(401).json({ success: false, message: 'User not found', data: null });
      };

      // Step-04: Attach the user to the request object for further use in the route handlers
      req.user = user;

      // Step-05: Proceed to the next middleware or route handler
      return next();
   } catch (error) {
      return res.status(500).json({ success: false, message: 'Server error while authenticating user', error: error.message });
   };
};

// define authCompany middleware function to authenticate company
// this middleware should be used after authUser middleware to ensure that the user is authenticated before checking for company membership
authMiddleware.authCompany = async (req, res, next) => {
   try {
      // step-01: Extract the company ID from the request header, query parameters, or body
      const companyId = req.header('company-id') || req.query.companyId || req.body.companyId;

      // Step-02: Validate the companyId
      if (!companyId || !mongoose.isValidObjectId(companyId)) {
         return res.status(400).json({ success: false, message: 'Invalid or missing company ID', data: null });
      };

      // Step-03: Check if the company exist with the same company ID
      const company = await Company.findById(companyId);
      if (!company) {
         return res.status(404).json({ success: false, message: 'There is no company with the provided ID', data: null });
      };

      // Step-04: Find the user from the request object (set by authUser middleware)
      const user = req.user;
      if (!user) {
         return res.status(401).json({ success: false, message: 'User not authenticated', data: null });
      };

      // Step-05: Check if the user is a member of the company
      const membership = await Membership.findOne({userId: user._id, companyId: company._id});
      if (!membership) {
         return res.status(403).json({ success: false, message: 'You are not a member of this company', data: null });
      };

      // Step-06: Attach the company and membership information to the request object for further use in the route handlers
      req.company = company;
      req.membership = membership;

      // Step-07: Attach the user role in the company to the user object for further use in the route handlers
      req.user.role = membership.role;

      // Step-08: Proceed to the next middleware or route handler
      return next();
   } catch (error) {
      return res.status(500).json({ success: false, message: 'Server error while authenticating company', error: error.message });
   };
};

// export the authMiddleware object
module.exports = authMiddleware;