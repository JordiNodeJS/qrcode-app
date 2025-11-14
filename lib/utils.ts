/**
 * Shared utility functions used across the application
 */

/**
 * Validates an email address format
 * @param email - The email string to validate
 * @returns true if the email format is valid
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Escapes HTML special characters to prevent XSS
 * @param str - The string to escape
 * @returns Escaped string safe for HTML insertion
 */
export const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

/**
 * Validates form field length
 * @param value - The value to validate
 * @param min - Minimum length
 * @param max - Maximum length
 * @returns true if the length is within bounds
 */
export const validateLength = (
  value: string,
  min: number,
  max: number
): boolean => {
  const trimmed = value.trim();
  return trimmed.length >= min && trimmed.length <= max;
};

/**
 * Safe JSON logging with error handling
 * @param message - Log prefix message
 * @param data - Data to log
 */
export const safeLog = (message: string, data: unknown): void => {
  try {
    console.log(message, JSON.stringify(data, null, 2));
  } catch {
    console.log(message, data);
  }
};

/**
 * Safe JSON error logging with stack trace
 * @param message - Error prefix message
 * @param error - Error to log
 */
export const safeLogError = (message: string, error: unknown): void => {
  console.error(
    message,
    error instanceof Error ? error.stack || error.message : error
  );
  try {
    console.error(`${message} (raw):`, JSON.stringify(error));
  } catch {
    // Ignore serialization errors
  }
};
