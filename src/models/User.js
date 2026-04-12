const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

// Define the User Schema with fields: username, email, firebaseUID, role (with enum validation and default value) and password
const userSchema = new mongoose.Schema({
   username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
   },
   email: {
      type: String,
      required: [true, 'Email is required'],
      minlength: [5, 'Email must be at least 5 characters long'],
      unique: [true, 'User with this email already exists'],
      trim: true,
      lowercase: true,
      match: [/\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please use a valid email address.']
   },
   password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false // Exclude password from query results by default
   },
   firebaseUID: String,
}, { timestamps: true });

// Add a pre-save hook to hash the password before saving the user document
userSchema.pre('save', async function (next) {
   if (!this.isModified('password')) {
      return
   };

   try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
   } catch (error) {
      throw new Error(`Error hashing password: ${error.message}`, error);
   }
});

// Add a method to compare the provided password with the hashed password in the database
userSchema.methods.comparePassword = async function (candidatePassword) {
   try {
      if (!this.password) {
         throw new Error('Password field is not selected or does not exist in the user document. Ensure that the password field exists in the user document and use .select("+password") when querying the user to include the password field for comparison.');
      };

      return await bcrypt.compare(candidatePassword, this.password);
   } catch (error) {
      throw new Error('Error comparing password:' + error.message, error);
   };
};

// Add a method to generate a JWT token for the user
/**
 * @name generateAuthToken
 * @description Generates a JWT token for the user instance. The token is signed with the secret key defined in the environment variable JWT_SECRET and is set to expire in 10 hours.
 * @returns A JWT token generated from the user instance's payload, signed with the secret key defined in the environment variable JWT_SECRET, and set to expire in 10 hours.
 * @example
 * const user = await User.findOne({ email: 'john@example.com' });
 * const token = user.generateAuthToken();
 * Note: Ensure that the environment variable JWT_SECRET is set before calling this method to avoid errors.
 * 
 */
userSchema.methods.generateAuthToken = function () {
   try {
      const payload = {
         id: this._id,
         username: this.username,
         email: this.email,
      };

      return jsonwebtoken.sign(payload, process.env.JWT_SECRET, { expiresIn: '10h' });
   } catch (error) {
      throw new Error('Error generating auth token: ' + error.message, error);
   }
};

// Add a static method to generate a JWT token for a user
/**
 * @name generateAuthToken
 * @description Generates a JWT token for a user based on the provided payload. The token is signed with the secret key defined in the environment variable JWT_SECRET and is set to expire in 10 hours.
 * @param {*} payload 
 * @returns A JWT token generated from the provided payload, signed with the secret key defined in the environment variable JWT_SECRET, and set to expire in 10 hours.
 * @example
 * const token = User.generateAuthToken({ id: user._id, username: user.username, email: user.email, role: user.role });    
 * Note: Ensure that the environment variable JWT_SECRET is set before calling this method to avoid errors.
 */
userSchema.statics.generateAuthToken = function (payload) {
   try {
      return jsonwebtoken.sign(payload, process.env.JWT_SECRET, { expiresIn: '10h' });
   } catch (error) {
      throw new Error('Error generating auth token: ' + error.message, error);
   };
}

// Add a static method to validate the JWT token and return the decoded payload
/**
 * @name validateAuthToken
 * @description Validates a JWT token and returns the decoded payload if the token is valid. If the token is invalid or expired, it returns null.
 * @param {String} token - The JWT token to be validated.
 * @returns {Object | null} Returns the decoded payload if the token is valid, otherwise returns null.
 * @example
 * const token = User.generateAuthToken({ id: user._id, username: user.username, email: user.email, role: user.role });
 * const decoded = User.validateAuthToken(token);
 * if (decoded) {
 *   console.log('Token is valid. Decoded payload:', decoded);
 * } else {
 *   console.log('Invalid token');
 * }
 */
userSchema.statics.validateAuthToken = function (token) {
   try {
      return jsonwebtoken.verify(token, process.env.JWT_SECRET);
   } catch (error) {
      return null;
   }
};

// Add a static method to generate a hashed password from a plain text password
/**
 * @name hashPassword
 * @description Generates a hashed password from a plain text password using bcrypt. The method takes a plain text password as input and returns the hashed version of the password.
 * @param {String} password - The plain text password to be hashed.
 * @return {Promise<String>} A promise that resolves to the hashed password.
 * @example
 * const hashedPassword = await User.hashPassword('myPlainTextPassword');
 * 
 * Note: This method is typically used internally before saving a user document to the database, and it is not necessary to create a hashed password manually when creating a user, as the pre-save hook will handle password hashing automatically. However, this method can be useful for hashing passwords in other contexts, such as during user authentication or when updating a user's password.
 */
userSchema.statics.hashPassword = async function (password) {
   try {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
   } catch (error) {
      throw new Error('Error hashing password: ' + error.message, error);
   };
};


// Create the User model using the defined schema
const User = mongoose.model('User', userSchema);

// Export the User model for use in other parts of the application
module.exports = User;