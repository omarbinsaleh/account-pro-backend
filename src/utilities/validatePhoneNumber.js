const libphonenumber = require('google-libphonenumber');

// Cache instance and formats at module level for optimal performance
const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
const PNF = libphonenumber.PhoneNumberFormat;
const PNT = libphonenumber.PhoneNumberType;

// Regex to quickly validate ISO 3166-1 alpha-2 format before hitting the C++ binding layer
const ISO_COUNTRY_REGEX = /^[A-Z]{2}$/;

// Map numeric enums to human-readable strings safely
const LINE_TYPE_MAP = Object.freeze({
   [PNT.FIXED_LINE]: 'FIXED_LINE',
   [PNT.MOBILE]: 'MOBILE',
   [PNT.FIXED_LINE_OR_MOBILE]: 'FIXED_LINE_OR_MOBILE',
   [PNT.TOLL_FREE]: 'TOLL_FREE',
   [PNT.PREMIUM_RATE]: 'PREMIUM_RATE',
   [PNT.SHARED_COST]: 'SHARED_COST',
   [PNT.VOIP]: 'VOIP',
   [PNT.PERSONAL_NUMBER]: 'PERSONAL_NUMBER',
   [PNT.PAGER]: 'PAGER',
   [PNT.UAN]: 'UAN',
   [PNT.VOICEMAIL]: 'VOICEMAIL',
   [PNT.UNKNOWN]: 'UNKNOWN',
});

/**
 * Validates and formats a phone number against industry standards.
 * 
 * @name validatePhoneNumber
 * @description Validates a phone number using Google's libphonenumber library, ensuring it adheres to international standards and is appropriate for the specified country.
 * @param {string} phoneNumber - Raw phone input (e.g., '01600309757').
 * @param {string} countryCode - Two-letter ISO country code (e.g., 'BD').
 * @returns {Readonly<{isValid: boolean, formatted: string|null, lineType: string|null, error: string|null}>}
 * 
 * @example
 * const result = validatePhoneNumber('01600309757', 'BD');
 * // result => { isValid: true, formatted: '+8801600309757', lineType: 'MOBILE', error: null }
 * 
 * @example
 * const result = validatePhoneNumber('12345', 'US');
 * // result => { isValid: false, formatted: null, lineType: null, error: 'STRUCTURE_INVALID' }
 * 
 * @example
 * const result = validatePhoneNumber('01600309757', 'XX');
 * // result => { isValid: false, formatted: null, lineType: null, error: 'INVALID_ISO_COUNTRY_CODE' }
 * 
 * @example
 * const result = validatePhoneNumber('01600309757', 'US');
 * // result => { isValid: false, formatted: null, lineType: null, error: 'REGION_MISMATCH' }
 * 
 * @example
 * const result = validatePhoneNumber('', 'US');
 * // result => { isValid: false, formatted: null, lineType: null, error: 'INVALID_PHONE_PARAMETER' }
 * 
 * @example
 * const result = validatePhoneNumber('01600309757', '');
 * // result => { isValid: false, formatted: null, lineType: null, error: 'INVALID_COUNTRY_PARAMETER' }
 * 
 * @author Omar Bin Saleh
 * @email omarbinsaleh44@gamil.com
 * 
 * @version 1.0.0
 * @license MIT
 */
const validatePhoneNumber = function (phoneNumber, countryCode) {
   // 1. Strict Input Type & Presence Validation
   if (typeof phoneNumber !== 'string' || !phoneNumber.trim()) {
      return Object.freeze({ isValid: false, formatted: null, lineType: null, error: 'INVALID_PHONE_PARAMETER' });
   }

   if (typeof countryCode !== 'string') {
      return Object.freeze({ isValid: false, formatted: null, lineType: null, error: 'INVALID_COUNTRY_PARAMETER' });
   }

   const sanitizedCountry = countryCode.trim().toUpperCase();
   if (!ISO_COUNTRY_REGEX.test(sanitizedCountry)) {
      return Object.freeze({ isValid: false, formatted: null, lineType: null, error: 'INVALID_ISO_COUNTRY_CODE' });
   }

   try {
      // 2. Fast Fail check: Ensure the library actually supports the requested region
      if (!phoneUtil.getSupportedRegions().includes(sanitizedCountry)) {
         return Object.freeze({ isValid: false, formatted: null, lineType: null, error: 'UNSUPPORTED_REGION' });
      }

      // 3. Parse with raw input preservation to honor local dialing variations
      const parsedNumber = phoneUtil.parseAndKeepRawInput(phoneNumber.trim(), sanitizedCountry);

      // 4. Structural Verification
      if (!phoneUtil.isValidNumber(parsedNumber)) {
         return Object.freeze({ isValid: false, formatted: null, lineType: null, error: 'STRUCTURE_INVALID' });
      }

      // 5. Deep Region Check (Catches edge cases where length matches but prefix is impossible)
      if (!phoneUtil.isValidNumberForRegion(parsedNumber, sanitizedCountry)) {
         return Object.freeze({ isValid: false, formatted: null, lineType: null, error: 'REGION_MISMATCH' });
      }

      // 6. Extraction & Safe Object Freezing
      const numberType = phoneUtil.getNumberType(parsedNumber);
      const lineType = LINE_TYPE_MAP[numberType] || 'UNKNOWN';
      const formatted = phoneUtil.format(parsedNumber, PNF.E164);

      return Object.freeze({
         isValid: true,
         formatted,
         lineType,
         error: null
      });

   } catch (err) {
      // 7. Graceful abstraction of underlying library errors
      return Object.freeze({
         isValid: false,
         formatted: null,
         lineType: null,
         error: err instanceof Error ? err.message : 'UNKNOWN_PARSING_ERROR'
      });
   }
};

// Export the function for external usage
module.exports = validatePhoneNumber;