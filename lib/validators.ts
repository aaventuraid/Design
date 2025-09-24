/**
 * Validation utilities
 * Centralized validation functions to prevent code duplication
 */

// Email validation regex pattern
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation - at least 8 characters
const PASSWORD_MIN_LENGTH = 8;

export const validators = {
  /**
   * Validates email format
   */
  validateEmail: (email: string): boolean => {
    if (!email || typeof email !== 'string') return false;
    return EMAIL_REGEX.test(email.trim().toLowerCase());
  },

  /**
   * Validates password strength
   */
  validatePassword: (password: string): boolean => {
    if (!password || typeof password !== 'string') return false;
    return password.length >= PASSWORD_MIN_LENGTH;
  },

  /**
   * Validates username format
   */
  validateUsername: (username: string): boolean => {
    if (!username || typeof username !== 'string') return false;
    const trimmed = username.trim();
    // Username should be 3-30 characters, alphanumeric + underscore
    return /^[a-zA-Z0-9_]{3,30}$/.test(trimmed);
  },

  /**
   * Sanitizes user input by trimming whitespace
   */
  sanitizeInput: (input: string): string => {
    if (!input || typeof input !== 'string') return '';
    return input.trim();
  },
};

export const { validateEmail, validatePassword, validateUsername, sanitizeInput } = validators;
