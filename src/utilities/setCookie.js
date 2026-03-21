// import ncessary modules
const express = require('express');

/**
 * Sets a cookie on the response object.
 * @param {express.Response} res - The express response object.
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value of the cookie.
 * @param {Object} [options] - Optional cookie options.
 * @throws {InvalidResponseObjectError} - If the response object is invalid.
 * @throws {InvalidCookieNameError} - If the cookie name is invalid.
 * @throws {InvalidCookieValueError} - If the cookie value is invalid.
 * 
 * @returns {express.Response} It returns the Express Response object for chaining.
 * 
 * @example
 * // Example usage in an Express route handler
 * app.post('/login', (req, res) => {
 *    const token = generateAuthToken(user); // Assume this function generates a JWT token for the user
 *    setCookie(res, 'authToken', token);
 *    res.json({ success: true, message: 'Logged in successfully' });
 * });
 */
function setCookie(res, name, value, options = {}) {
   // validate the response objec
   if (!res || typeof res !== 'object' || typeof res.cookie !== 'function' || typeof res.send !== 'function' || typeof res.status !== 'function' || typeof res.json !== 'function' || res.app === undefined) {
      const error = new Error('Invalid response object provided. Expected an Express response object.');
      error.name = 'InvalidResponseObjectError';
      throw error;
   };

   // validate name
   if (!name || typeof name !== 'string' || !name.trim().length) {
      const error = new Error('Invalid cookie name provided. Expected a valid string');
      error.name = 'InvalidCookieNameError'
      throw error;
   };

   // validate value
   if (!value || typeof value !== 'string' || !value.trim().length) {
      const error = new Error('Invalid value provided for cookie. Expected a valid string');
      error.name = 'InvalidCookieValueError'
      throw error;
   };

   // set default cookie options and override with the provided options
   const cookieOptions = {
      path: options.path ?? '/',
      httpOnly: options.httpOnly ?? true,
      secure: options.secure ?? process.env.NODE_ENV === 'production',
      sameSite: options.sameSite ?? 'Strict',
      maxAge: options.maxAge ?? 20 * 60 * 60 * 1000, //
      ...options
   };

   // set the cookie using the express response object
   res.cookie(name, value, cookieOptions);
   return res;
};

// export the setCookie function
module.exports = setCookie;