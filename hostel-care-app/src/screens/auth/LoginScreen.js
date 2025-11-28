/**
 * LOGIN SCREEN
 *
 * This is the screen where users log in to their account.
 * They enter their email and password to access the app.
 *
 * Flow:
 * 1. User enters email and password
 * 2. Click login button
 * 3. Validate inputs
 * 4. If valid, attempt login (Firebase Auth will be connected later)
 * 5. On success, navigate to main app
 * 6. On error, show error message
 */

import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../../utils/colors';
import { validateEmail, validatePassword } from '../../utils/helpers';

export default function LoginScreen({ navigation }) {
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  // These variables store the user's input and app state

  const [email, setEmail] = useState(''); // Stores the email input
  const [password, setPassword] = useState(''); // Stores the password input
  const [loading, setLoading] = useState(false); // Shows loading spinner when logging in
  const [errors, setErrors] = useState({}); // Stores validation error messages

  // ========================================
  // VALIDATION FUNCTION
  // ========================================
  /**
   * Validates the form inputs before login
   * Returns true if valid, false if errors found
   */
  const validateForm = () => {
    const newErrors = {};

    // Check if email is empty
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    }
    // Check if email format is valid
    else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Check if password is empty
    if (!password) {
      newErrors.password = 'Password is required';
    }
    // Check if password meets requirements
    else {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.message;
      }
    }

    // Update errors state
    setErrors(newErrors);

    // Return true if no errors, false if errors exist
    return Object.keys(newErrors).length === 0;
  };

  // ========================================
  // LOGIN HANDLER
  // ========================================
  /**
   * Handles the login process when user clicks "Login" button
   */
  const handleLogin = async () => {
    // First, validate the form
    if (!validateForm()) {
      return; // Stop if validation fails
    }

    try {
      // Show loading state
      setLoading(true);

      //   TODO: Add Firebase Authentication here
      // For now, we'll simulate a login with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate successful login
      console.log('Login successful!', { email, password });

      //   TODO: Navigate to the main app after successful login
      // navigation.navigate('MainApp');

      Alert.alert('Success', 'Login successful! (Firebase not connected yet)');
    } catch (error) {
      // If login fails, show error message
      Alert.alert('Login Failed', error.message || 'Something went wrong');
    } finally {
      // Hide loading state
      setLoading(false);
    }
  };

  // ========================================
  // RENDER UI
  // ========================================
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Login to your HostelCare account</Text>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Enter your email"
              placeholderTextColor={COLORS.textLight}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                // Clear error when user starts typing
                if (errors.email) {
                  setErrors({ ...errors, email: null });
                }
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {/* Show error message if exists */}
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Enter your password"
              placeholderTextColor={COLORS.textLight}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                // Clear error when user starts typing
                if (errors.password) {
                  setErrors({ ...errors, password: null });
                }
              }}
              secureTextEntry
              autoCapitalize="none"
            />
            {/* Show error message if exists */}
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Sign Up Link */}
          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.signupText}>
              Don't have an account?{' '}
              <Text style={styles.signupTextBold}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ========================================
// STYLES
// ========================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    backgroundColor: COLORS.disabled,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: 16,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  signupButton: {
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  signupTextBold: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
