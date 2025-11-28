/**
 * COLOR PALETTE
 *
 * This file contains all the colors used in the app.
 * Using a centralized color file makes it easy to:
 * - Maintain consistent design
 * - Change colors in one place
 * - Create a cohesive look and feel
 */

export const COLORS = {
  // Primary Colors - Main brand colors
  primary: '#2563EB',        // Blue - Trust, professionalism
  primaryDark: '#1E40AF',    // Darker blue for pressed states
  primaryLight: '#DBEAFE',   // Light blue for backgrounds

  // Secondary Colors
  secondary: '#10B981',      // Green - Success, completion
  secondaryDark: '#059669',  // Darker green
  secondaryLight: '#D1FAE5', // Light green

  // Status Colors - For complaint status
  pending: '#F59E0B',        // Orange - Waiting/Pending
  inProgress: '#3B82F6',     // Blue - In Progress
  resolved: '#10B981',       // Green - Resolved/Complete
  urgent: '#EF4444',         // Red - Urgent/High Priority

  // Neutral Colors - Backgrounds, text, borders
  white: '#FFFFFF',
  black: '#000000',
  background: '#F9FAFB',     // Light grey background
  surface: '#FFFFFF',        // Card/surface color

  // Text Colors
  textPrimary: '#111827',    // Almost black - Main text
  textSecondary: '#6B7280',  // Grey - Secondary text
  textLight: '#9CA3AF',      // Light grey - Placeholder text

  // Border & Divider
  border: '#E5E7EB',         // Light grey border
  divider: '#F3F4F6',        // Very light grey divider

  // Feedback Colors
  success: '#10B981',        // Green - Success messages
  error: '#EF4444',          // Red - Error messages
  warning: '#F59E0B',        // Orange - Warning messages
  info: '#3B82F6',           // Blue - Info messages

  // Disabled State
  disabled: '#D1D5DB',       // Grey - Disabled elements
  disabledText: '#9CA3AF',   // Light grey - Disabled text
};

/**
 * USAGE EXAMPLE:
 *
 * import { COLORS } from '../utils/colors';
 *
 * const styles = StyleSheet.create({
 *   button: {
 *     backgroundColor: COLORS.primary,
 *   },
 *   text: {
 *     color: COLORS.textPrimary,
 *   }
 * });
 */
