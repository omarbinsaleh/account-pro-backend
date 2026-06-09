/**
 * @name validateEmail
 * @description A utility function to validate email addresses. It checks for the presence of the email, ensures it's a string, and validates its format using a regular expression. The function returns an object indicating whether the email is valid and includes a message and the normalized email if valid.
 * @param {String} email 
 * @returns {{success: boolean, message: String, email: String | null }} An object containing the success status, a message, and the normalized email if valid.
 * @author Omar Bin Saleh
 * @email omarbinsaleh44@gmail.com
 * @created 2026-06-01
 * @updated 2026-06-01
 * @version 1.0.0
 * 
 * @example
 * const emailValidationResult = validateEmail('john.doe@example.com');
 * if (emailValidationResult.success) {
 *   console.log('Valid email:', emailValidationResult.email);
 * } else {
 *   console.log('Email validation failed:', emailValidationResult.message);
 * }
 */
const validateEmail = (email) => {
   // Step 01: Check if the email is provided and is a string
   if (!email || typeof email !== 'string' || email.trim().length < 5) {
      return { success: false, message: 'Invalid email address', email: null };
   };

   // Step 02: Normalize the email by trimming whitespace and converting to lowercase
   const normalizedEmail = email.trim().toLowerCase();

   // Step 03: Validate the email format using a regular expression
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!emailRegex.test(normalizedEmail)) {
      return { success: false, message: 'Invalid email address', email: null };
   };

   // Step 04: If the email is valid, return a success response with the normalized email
   return {
      success: true,
      message: 'Valid email address',
      email: normalizedEmail,
   };
};

module.exports = validateEmail;