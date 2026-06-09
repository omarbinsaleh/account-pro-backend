/**
 * @name validateURL
 * @description A utility function to validate URLs. It checks if the input is a non-empty string and then uses a regular expression to validate the URL format. The function returns an object indicating whether the URL is valid and includes a message.
 * @param {string} url - The URL string to validate.
 * @returns {{success: boolean, message: String, url: String | null }} An object containing the success status and a message and the normalized URL if valid.
 * @author Omar Bin Saleh
 * @email omarbinsaleh44@gmail.com
 * @created 01-06-2026
 * @updated 10-06-2026
 * @version 1.0.0
 * 
 * @example
 * const urlValidationResult = validateURL('https://www.example.com');
 * if (urlValidationResult.success) {
 *    console.log('Valid URL:', urlValidationResult.url);
 * } else {
 *    console.log('URL validation failed:', urlValidationResult.message);
 * };
 */
const validateURL = (url) => {
   if (typeof url !== 'string' || !url.trim().length) {
      return { success: false, message: 'URL must be a non-empty string.', url: null };
   };

   const urlPattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-zA-Z0-9\\-]+\\.)+[a-zA-Z]{2,})|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-zA-Z0-9%_\\.~+]*)*' + // port and path
      '(\\?[;&a-zA-Z0-9%_\\.~+=-]*)?' + // query string
      '(\\#[-a-zA-Z0-9_]*)?$', 'i'
   );

   const result = urlPattern.test(url);
   if (!result) {
      return { success: false, message: 'Invalid URL format.', url: null };
   };

   return { success: true, message: 'Valid URL.', url: url.trim().toLowerCase() };
};

module.exports = validateURL;