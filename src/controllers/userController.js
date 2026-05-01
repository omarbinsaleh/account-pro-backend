// import necessary modules and models
const mongoose = require('mongoose');
const User = require('../models/User');
const Membership = require('../models/Membership');
const utilities = require('../utilities');

// Define the userController object to hold all user-related controller functions
const userController = {};

/**
 * @name createUser
 * @route POST /api/users/register
 * @access Public
 * @description Controller function to create a new user in the database. It takes the user data from the request body, creates a new user document, and saves it to the database. If the user is created successfully, it returns a success message along with the created user data. If there is an error during the creation process, it returns an error message.
 * @param {Object} req - The request object containing the user data in the body.
 * @param {Object} res - The response object used to send the response back to the client.
 * @returns {Object} A JSON response containing a success message and the created user data if the user is created successfully, or an error message if there is an error during the creation process.
 * @example
 * // Example of the request body to create a new user:
 * {
 *  "username": "omar bin saleh",
 *  "email": "omarbinsaleh44@gmail.com",
 *  "password": "password123",
 * }
 * 
 * // Note: Ensure that the request body contains all the required fields (username, email, password, and role) and that the email is unique in the database to avoid errors during user creation.
 * 
 */
userController.createUser = async (req, res) => {
   try {
      // Step-01: Extract necessary data from the request body
      const { username, email, password } = req.body;

      // Step-02: Validate the username fields
      if (!username || typeof username !== 'string' || !username.trim().length) {
         return res.status(400).json({ success: false, message: 'Username is required and must be a non-empty string', data: null });
      };

      // Step-03: Validate the email field
      if (!email || typeof email !== 'string' || email.trim().length <= 4 || !email.includes('@')) {
         return res.status(400).json({ success: false, message: 'Email is required and must be a valid email address', data: null });
      };

      // Step-04: Validate the password field
      if (!password || typeof password !== 'string' || password.trim().length < 6) {
         return res.status(400).json({ success: false, message: 'Password is required and must be at least 6 characters long', data: null });
      };

      // Step-05: Check if the email already exists in the database, and if it does, return an error response
      const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
      if (existingUser) {
         return res.status(400).json({ success: false, message: 'User with this email already exists', data: null });
      };

      // Step-06: Create a new user document
      const newUser = new User({ username, email, password });

      // Step-07: Generate an authentication token for the new user, and set the token in cookies
      const token = newUser.generateAuthToken(); // -> **this method will either return a token or throw an error.

      // Step-08: Save the new user document to the database
      await newUser.save();

      // Step-09: Set the authentication token in the cookies
      utilities.setCookie(res, 'token', token);

      // Step-10: Convert the new user document to plain javascript object
      const newUserObj = newUser.toObject();

      // Step-11: Send a success response with the created user data
      return res.status(201).json({ success: true, message: 'User created successfully', data: { ...newUserObj, password: null }, token });
   } catch (error) {
      return res.status(500).json({ success: false, message: `Error creating user: ${error.message}`, data: null });
   };
};

/**
 * @name loginUser
 * @route POST /api/users/login
 * @access Public
 * @description Authenticates a user by email/password, generates a JWT, 
 * and sets it in an HTTP-only cookie.
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {Object} req.body - Login credentials.
 * @param {string} req.body.username - User's unique username.
 * @param {string} req.body.email - User's registered email address.
 * @param {string} req.body.password - User's plain-text password.
 * @param {import('express').Response} res - Express response object.
 * 
 * @returns {Promise<void>} 200 on success, 400 for validation errors, 401 for invalid credentials.
 */
userController.loginUser = async (req, res) => {
   try {
      // Step-01: Extract the email and password from the request body
      const { email, password } = req.body;

      // Step-02: Validate the email field
      if (!email || typeof email !== 'string' || email.trim().length < 5 || !email.includes('@')) {
         return res.status(400).json({ success: false, message: 'Email is required and must be a valid email address', data: null });
      };

      // Step-02: Validate the password field
      if (!password || typeof password !== 'string' || password.trim().length < 6) {
         return res.status(400).json({ success: false, message: 'Password is required and must be at least 6 characters long', data: null });
      };

      // Step-03: Find the user by email using the User model, and return an error response if the user is not found
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
         return res.status(404).json({ success: false, message: 'Invalid email or password', data: null });
      };

      // Step-04: Verify the password, and sen an error response if the password is not valid
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
         return res.status(401).json({ success: false, message: 'Invalid email or password', data: null });
      };

      // Step-05: Generate an authentication token for the user, and set the token in the cookies
      const token = user.generateAuthToken();
      utilities.setCookie(res, 'token', token);

      // Step-06: Convert the user document to user object (plain javascript object)
      const userObj = user.toObject();

      // Step-07: Send a success response with the user data and token
      return res.status(200).json({ success: true, message: 'User login successful', data: { ...userObj, password: null }, token });

   } catch (error) {
      return res.status(500).json({ success: false, message: `Error logging in user: ${error.message}`, data: null });
   };
};

/**
 * @name logoutUser
 * @route GET /api/users/logout/:id
 * @middleware authUser 
 * @access Private
 * @description Logs out the current user by clearing the authentication 
 * cookie and invalidating the current session.
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * 
 * @returns {Promise<void>} 200 on success with a confirmation message.
 */
userController.logoutUser = async (req, res) => {
   try {
      // Step-01: Extract the user ID from the query parameter, and validate the user Id
      const userId = req.params.id
      if (!userId || typeof userId !== 'string' || !userId.trim().length || !mongoose.isValidObjectId(userId)) {
         return res.status(400).json({ success: false, message: 'User ID is missing or invalid', data: null });
      };

      // Step-02: Find the user by ID and ensure they exist in the database, and send an error response if the user is not found
      const user = await User.findById(userId);
      if (!user) {
         return res.status(404).json({ success: false, message: 'User not found', data: null });
      };

      // Step-05: Verify that the user making the request is the same as the user being logged out, and if not return a 403 error response
      if (user.id !== req.user.id) {
         return res.status(403).json({ success: false, message: 'You do not have access to this resource', data: null });
      };

      // Step-06: Cleare the token
      res.clearCookie('token');

      // Step-07: Send a success response
      return res.status(200).json({ success: true, message: 'User logout successful', data: { ...user.toObject(), password: null } });
   } catch (error) {
      console.log(error);
      // Step-08: Send an error response if there is an error during the logout process
      return res.status(500).json({ success: false, message: `Error logging out user: ${error.message}`, data: null });
   };
};

/**
 * @name getAllUsers
 * @route GET /api/users
 * @middleware authUser -> authCompany 
 * @aaccess Private (Requires authentication and appropriate user role)
 * @description Controller function to retrieve all users associated with a particular company from the database. It queries the User model to find all user documents and returns them in the response. If there is an error during the retrieval process, it returns an error message.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object used to send the response back to the client.
 * @returns {Object} A JSON response containing a success message and the retrieved user data if the users are retrieved successfully, or an error message if there is an error during the retrieval process.
 * 
 * Note: Ensure that the User, Membership, and Company models are properly defined and connected to the database before using this controller function to retrieve users. Also, consider implementing pagination or filtering if the number of users in the database is large to optimize performance and reduce response time.
 * 
 */
userController.getAllUsers = async (req, res) => {
   try {
      // Step-01: Extract pagination information from query parameters, and set default values if not provided
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10
      const skip = (page - 1) * limit;


      // Step-02: Extract the user and company information from the request object (set by the authUser and authCompany middlewares)
      const user = req.user;
      const company = req.company;

      // Step-03: Check if the user and company are available in the request object, and if not, return an error response
      if (!user || typeof user !== 'object' || !company || typeof company !== 'object') {
         return res.status(401).json({ success: false, message: 'User authentication or company authentication failed', data: [] });
      };

      // Step-04: Check if the user is an admin or the owner of the company, and if not, return a 403 error response
      if (user.role !== 'admin' && user.role !== 'owner' && company.owner.toString() !== user._id.toString()) {
         return res.status(403).json({ success: false, message: 'You do not have permission to access this resource', data: [] });
      }

      // Step-05: Set up pagination information for the response
      const totalUsers = await Membership.countDocuments({ companyId: company._id });
      const totalPages = Math.ceil(totalUsers / limit);
      const pagination = {
         totalUsers,
         totalPages,
         pageSiize: limit,
         currentPage: page,
         nextPage: page < totalPages ? page + 1 : null,
         preveousPage: page > 1 ? page -1 : null,
      }

      // Step-06: Find all all the members of the company using the Membership model, and populate the user information for each member
      const members = await Membership.find({ companyId: company._id }).limit(limit).skip(skip).populate('userId');
      const users = members.map(member => {
         const userObj = member.userId.toObject();
         return {...userObj, password: null, role: member.role };
      });

      // Step-07: Send a success response with the retrieved users data and pagination information
      return res.status(200).json({ success: true, message: 'Users retrieved successfully', data: users, pagination });
   } catch (error) {
      // Step-08: Send an error response if there is an error during the retrieval process
      return res.status(500).json({ success: false, message: `Error retrieving users: ${error.message}`, data: [] });
   };
};

/**
 * @name getUserById
 * @route GET /api/users/:id
 * @middleware authUser -> authCompany
 * @access Private (Admin or Account Owner)
 * @description Retrieves a specific user by their ID. Validates the JWT from 
 * cookies or headers and ensures the requester has sufficient permissions.
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {string} req.params.id - The UUID or ID of the user to retrieve.
 * @param {import('express').Response} res - Express response object.
 * 
 * @returns {Promise<void>} Returns 200 with user data, 401/403 for auth issues, or 500 on error.
 */
userController.getUserById = async (req, res) => {
   try {
      // Step-01: Extract the user ID from the request parameters and validate the user ID
      const userId = req.params.id;
      if (!userId || typeof userId !== 'string' || !userId.trim().length || !mongoose.isValidObjectId(userId)) {
         return res.status(400).json({ success: false, message: 'User ID is missing', data: null });
      };

      // Step-02: check if the user and company information are available in the request object (set by the authUser and authCompany middlewares), and if not, return an error response
      if (!req.user || typeof req.user !== 'object' || !req.company || typeof req.company !== 'object') {
         return res.status(401).json({ success: false, message: 'User authentication or company authentication failed', data: null });
      };

      //Step-03: Authorize the user to check if the user has permission to access the requested resource ( the user themselves, or an admin, or the owner of the company)
      if (req.user.id !== userId && req.user.role !== 'admin' && req.user.role !== 'owner' && req.company.owner.toString() !== req.user._id.toString()) {
         res.clearCookie('token');
         return res.status(403).json({ success: false, message: 'Access denied. You do not have permission to access this resource.', data: null });
      };

      // Step-04: Check if the user is a member of the company using the Membership model, and if not, return a 403 error response
      const membership = await Membership.findOne({ userId, companyId: req.company._id }).populate('userId');
      if (!membership) {
         return res.status(403).json({ success: false, message: 'User is not a member of this company', data: null });
      }

      // Step-05: Extract the user information from the membership document, and if the user is not found, return a 404 error response
      const user = membership.userId;
      if (!user) {
         return res.status(404).json({ success: false, message: 'User not found', data: null });
      };

      // Step-05: Send a success response with necessary data
      return res.status(200).json({ success: true, message: 'User details returned successfully', data: user });
   } catch (error) {
      // Step-06: Send an error response if there is an error during the retrieval process
      return res.status(500).json({ success: false, message: `Error retrieving user: ${error.message}`, data: null });
   };
};

/**
 * @name updateUserById
 * @route PATCH /api/users/:id
 * @middleware authUser -> authCompany
 * @access Private (Account Owner Only )
 * @description Updates user profile information. Validates JWT from cookies/headers. 
 * Only users can update their own username, email, or password.
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {string} req.params.id - The ID of the user to update.
 * @param {Object} req.body - The update payload.
 * @param {string} [req.body.username] - New username.
 * @param {string} [req.body.email] - New email address.
 * @param {string} [req.body.password] - New password.
 * @param {string} [req.body.role] - New user role (Admin only).
 * @param {import('express').Response} res - Express response object.
 * 
 * @returns {Promise<void>} 200 on success, 400 for empty payload, 401/403 for auth issues, 404 if not found.
 */
userController.updateUserById = async (req, res) => {
   try {
      // Step-01: Extract the user and company information from the request object (set by the authUser and authCompany middlewares)
      const user = req.user;
      const company = req.company;

      // Step-02: Check if the user and company are available in the request object, and if not, return an error response
      if (!user || typeof user !== 'object' || !company || typeof company !== 'object') {
         return res.status(401).json({ success: false, message: 'User authentication or company authentication failed', data: null });
      }

      // Step-03: Extract the user ID from the request parameters
      const userId = req.params.id;
      if (!userId || typeof userId !== 'string' || !userId.trim().length || !mongoose.isValidObjectId(userId)) {
         return res.status(400).json({ success: false, message: 'Invalid or missing user ID', data: null });
      };
      
      // Step-04: Extract the updated user data from the request body
      const { username, email, password } = req.body;

      // Step-05: Validate the username field if it is provided
      if (username && (typeof username !== 'string' || !username.trim().length)) {
         return res.status(400).json({ success: false, message: 'Username must be a non-empty string', data: null });
      };

      // Step-06: Validate the email field if it is provided
      if (email && (typeof email !== 'string' || !email.trim().length <= 4 || !email.includes('@'))) {
         return res.status(400).json({ success: false, message: 'Email must be a valid email address', data: null });
      };

      // Step-07: Validate the password field, if it is provided
      if (password && (typeof password !== 'string' || !password.trim().length < 6)) {
         return res.status(400).json({ success: false, message: 'New password must be a non-empty string', data: null });
      };

      // Step-08: Check if the user has permisssion to access the requested resource ( the user themselves)
      if (user.id !== userId) {
         res.clearCookie('token');
         return res.status(403).json({ success: false, message: 'Access denied. You do not have permission to access this resource.', data: null });
      };

      // step-9: Prepare the payload object to hold the updated user data
      const payload = {};
      if (username) payload.username = username;
      if (email) payload.email = email;
      if (password) {
         const hashedPassword = await User.hashPassword(password);
         payload.password = hashedPassword;
      };

      // Step-10: Check if there is any data to update
      if (Object.keys(payload).length === 0) {
         return res.status(400).json({ success: false, message: 'No valid fields provided for update', data: null });
      };

      // Step-11: Find the user by ID and update their information using the User model, and if the user is not found, return a 404 error
      const updatedUser = await User.findByIdAndUpdate(userId, payload, { returnDocument: 'after', runValidators: true });
      if (!updatedUser) {
         return res.status(404).json({ success: false, message: 'User not found', data: null });
      };

      // Step-12: Generate a new authentication token for the updated user
      const newToken = updatedUser.generateAuthToken();
      if (!newToken) {
         return res.status(500).json({ success: false, message: 'Error generating authentication token for updated user', data: null });
      };

      // Step-13: Set the new token in cookies
      utilities.setCookie(res, 'token', newToken);

      // Step-14: Send a success response with the updated user data
      return res.status(200).json({ success: true, message: 'User updated successfully', data: updatedUser, token: newToken });
   } catch (error) {
      return res.status(500).json({ success: false, message: `Error updating user: ${error.message}`, data: null });
   };
};

/**
 * @name deleteUserById
 * @route DELETE /api/users/:id
 * @middleware authUser -> authCompany
 * @access Private (Admin or Account Owner)
 * @description Permanently deletes a user from the database. 
 * Validates the requester's JWT and ensures they are either an admin 
 * or the owner of the account being deleted.
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {string} req.params.id - The ID of the user to be deleted.
 * @param {import('express').Response} res - Express response object.
 * 
 * @returns {Promise<void>} 200 on success, 400 for invalid ID, 401/403 for auth issues, 404 if not found.
 */
userController.deleteUserById = async (req, res) => {
   try {
      // Step-01: extract the user ID from the request parameters and validate the user ID
      const userId = req.params?.id;
      if (!userId || typeof userId !== 'string' || !userId.trim().length || !mongoose.isValidObjectId(userId)) {
         return res.status(400).json({ success: false, message: 'Invalid or missing user ID', data: null });
      };

      // Step-02: Check if the user and company information are available in the request object (set by the authUser and authCompany middlewares), and if not, return an error response
      if (!req.user || typeof req.user !== 'object' || !req.company || typeof req.company !== 'object') {
         return res.status(401).json({ success: false, message: 'User authentication or company authentication failed', data: null });
      };

      // Step-03: Authorize the user to check to see if the user has permisssion to access the requested resource (admin or the user themselves)
      if (req.user.id !== userId) {
         res.clearCookie('token');
         return res.status(403).json({ success: false, message: 'Access denied. You do not have permission to access this resource.', data: null });
      };

      // Step-04: find the user by ID and delete, and if the user is not found, return a 404 error
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
         return res.status(404).json({ success: false, message: 'User not found', data: null });
      };

      // Step-05: Clear the authentication token from cookies
      res.clearCookie('token');

      // Step-06: send a success response with the deleted user data
      return res.status(200).json({ success: true, message: 'User deleted successfully', data: deletedUser });
   } catch (error) {
      return res.status(500).json({ success: false, message: `Error deleting user: ${error.message}`, data: null });
   };
};

// export the userController object to be used in other parts of the application
module.exports = userController;