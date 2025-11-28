/**
 * HELPER FUNCTIONS
 *
 * This file contains reusable utility functions used throughout the app.
 * These are simple, focused functions that help with common tasks.
 */

/**
 * Validates if an email is in correct format
 *
 * @param {string} email - The email to validate
 * @returns {boolean} - True if valid, false otherwise
 *
 * Example:
 * validateEmail('tushar@example.com') // returns true
 * validateEmail('invalidemail') // returns false
 */
export const validateEmail = (email) => {
  // Simple regex pattern for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates if a password meets minimum requirements
 *
 * @param {string} password - The password to validate
 * @returns {object} - { isValid: boolean, message: string }
 *
 * Requirements:
 * - At least 6 characters long
 *
 * Example:
 * validatePassword('12345') // returns { isValid: false, message: 'Password must be at least 6 characters' }
 * validatePassword('password123') // returns { isValid: true, message: '' }
 */
export const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return {
      isValid: false,
      message: 'Password must be at least 6 characters',
    };
  }

  return {
    isValid: true,
    message: '',
  };
};

/**
 * Validates if a name is valid (not empty, at least 2 characters)
 *
 * @param {string} name - The name to validate
 * @returns {boolean} - True if valid, false otherwise
 *
 * Example:
 * validateName('Tushar') // returns true
 * validateName('T') // returns false
 */
export const validateName = (name) => {
  return name && name.trim().length >= 2;
};

/**
 * Formats a date to a readable string
 *
 * @param {Date|string} date - The date to format
 * @returns {string} - Formatted date string
 *
 * Example:
 * formatDate(new Date()) // returns "28 Nov 2025"
 */
export const formatDate = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const day = dateObj.getDate();
  const month = dateObj.toLocaleString('en-US', { month: 'short' });
  const year = dateObj.getFullYear();

  return `${day} ${month} ${year}`;
};

/**
 * Formats a date to show time ago (e.g., "2 hours ago")
 *
 * @param {Date|string} date - The date to format
 * @returns {string} - Time ago string
 *
 * Example:
 * formatTimeAgo(new Date(Date.now() - 3600000)) // returns "1 hour ago"
 */
export const formatTimeAgo = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);

  // Less than a minute
  if (diffInSeconds < 60) {
    return 'Just now';
  }

  // Less than an hour
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }

  // Less than a day
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }

  // Less than a week
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }

  // More than a week, show date
  return formatDate(dateObj);
};

/**
 * Capitalizes the first letter of a string
 *
 * @param {string} str - The string to capitalize
 * @returns {string} - Capitalized string
 *
 * Example:
 * capitalize('hello') // returns "Hello"
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Truncates a string to a maximum length
 *
 * @param {string} str - The string to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated string with "..." if needed
 *
 * Example:
 * truncateText('This is a long text', 10) // returns "This is a..."
 */
export const truncateText = (str, maxLength = 50) => {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};

/**
 * Gets status color based on complaint status
 *
 * @param {string} status - The status ('pending', 'in-progress', 'resolved')
 * @returns {string} - Color code
 */
export const getStatusColor = (status) => {
  const { COLORS } = require('./colors');

  const statusColors = {
    pending: COLORS.pending,
    'in-progress': COLORS.inProgress,
    resolved: COLORS.resolved,
  };

  return statusColors[status] || COLORS.textSecondary;
};
