/**
 * SIGNUP SCREEN
 *
 * This is the screen where new users create an account.
 * They provide their details and select their role (Student or Warden).
 *
 * Flow:
 * 1. User enters name, email, password, and confirms password
 * 2. User selects role (Student or Warden)
 * 3. If Student, they enter hostel block and room number
 * 4. Click signup button
 * 5. Validate all inputs
 * 6. If valid, create account (Firebase Auth will be connected later)
 * 7. On success, navigate to main app
 * 8. On error, show error message
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
import { validateEmail, validatePassword, validateName } from '../../utils/helpers';

export default function SignupScreen({ navigation }) {
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  // These variables store the user's input and app state

  const [name, setName] = useState(''); // Stores the user's name
  const [email, setEmail] = useState(''); // Stores the email input
  const [password, setPassword] = useState(''); // Stores the password input
  const [confirmPassword, setConfirmPassword] = useState(''); // Stores the confirm password input
  const [role, setRole] = useState('student'); // Stores selected role: 'student' or 'warden'
  const [hostelBlock, setHostelBlock] = useState(''); // For students only - their hostel block
  const [roomNumber, setRoomNumber] = useState(''); // For students only - their room number
  const [loading, setLoading] = useState(false); // Shows loading spinner when signing up
  const [errors, setErrors] = useState({}); // Stores validation error messages

  // ========================================
  // VALIDATION FUNCTION
  // ========================================
  /**
   * Validates the form inputs before signup
   * Returns true if valid, false if errors found
   */
  const validateForm = () => {
    const newErrors = {};

    // Validate Name
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!validateName(name)) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Validate Email
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Validate Password
    if (!password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.message;
      }
    }

    // Validate Confirm Password
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // If role is student, validate hostel details
    if (role === 'student') {
      if (!hostelBlock.trim()) {
        newErrors.hostelBlock = 'Hostel block is required';
      }

      if (!roomNumber.trim()) {
        newErrors.roomNumber = 'Room number is required';
      }
    }

    // Update errors state
    setErrors(newErrors);

    // Return true if no errors, false if errors exist
    return Object.keys(newErrors).length === 0;
  };

  // ========================================
  // SIGNUP HANDLER
  // ========================================
  /**
   * Handles the signup process when user clicks "Sign Up" button
   */
  const handleSignup = async () => {
    // First, validate the form
    if (!validateForm()) {
      return; // Stop if validation fails
    }

    try {
      // Show loading state
      setLoading(true);

      // Prepare user data
      const userData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        ...(role === 'student' && {
          hostelBlock: hostelBlock.trim(),
          roomNumber: roomNumber.trim(),
        }),
      };

      //   TODO: Add Firebase Authentication here
      // For now, we'll simulate signup with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate successful signup
      console.log('Signup successful!', userData);

      //   TODO: Navigate to the main app after successful signup
      // navigation.navigate('MainApp');

      Alert.alert(
        'Success',
        'Account created successfully! (Firebase not connected yet)'
      );
    } catch (error) {
      // If signup fails, show error message
      Alert.alert('Signup Failed', error.message || 'Something went wrong');
    } finally {
      // Hide loading state
      setLoading(false);
    }
  };

  // ========================================
  // ROLE SELECTION COMPONENT
  // ========================================
  /**
   * Renders the role selection buttons (Student or Warden)
   */
  const RoleSelector = () => (
    <View style={styles.roleSelector}>
      <Text style={styles.label}>I am a</Text>
      <View style={styles.roleButtons}>
        {/* Student Button */}
        <TouchableOpacity
          style={[
            styles.roleButton,
            role === 'student' && styles.roleButtonActive,
          ]}
          onPress={() => {
            setRole('student');
            // Clear any role-related errors
            setErrors({ ...errors, hostelBlock: null, roomNumber: null });
          }}
        >
          <Text
            style={[
              styles.roleButtonText,
              role === 'student' && styles.roleButtonTextActive,
            ]}
          >
            Student
          </Text>
        </TouchableOpacity>

        {/* Warden Button */}
        <TouchableOpacity
          style={[
            styles.roleButton,
            role === 'warden' && styles.roleButtonActive,
          ]}
          onPress={() => {
            setRole('warden');
            // Clear student-specific fields when switching to warden
            setHostelBlock('');
            setRoomNumber('');
            setErrors({ ...errors, hostelBlock: null, roomNumber: null });
          }}
        >
          <Text
            style={[
              styles.roleButtonText,
              role === 'warden' && styles.roleButtonTextActive,
            ]}
          >
            Warden
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join HostelCare today</Text>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          {/* Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="Enter your full name"
              placeholderTextColor={COLORS.textLight}
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) {
                  setErrors({ ...errors, name: null });
                }
              }}
              autoCapitalize="words"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

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
                if (errors.email) {
                  setErrors({ ...errors, email: null });
                }
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          {/* Role Selection */}
          <RoleSelector />

          {/* Student-Specific Fields */}
          {role === 'student' && (
            <>
              {/* Hostel Block Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Hostel Block</Text>
                <TextInput
                  style={[styles.input, errors.hostelBlock && styles.inputError]}
                  placeholder="e.g., Block A, Block B"
                  placeholderTextColor={COLORS.textLight}
                  value={hostelBlock}
                  onChangeText={(text) => {
                    setHostelBlock(text);
                    if (errors.hostelBlock) {
                      setErrors({ ...errors, hostelBlock: null });
                    }
                  }}
                  autoCapitalize="words"
                />
                {errors.hostelBlock && (
                  <Text style={styles.errorText}>{errors.hostelBlock}</Text>
                )}
              </View>

              {/* Room Number Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Room Number</Text>
                <TextInput
                  style={[styles.input, errors.roomNumber && styles.inputError]}
                  placeholder="e.g., 101, 202"
                  placeholderTextColor={COLORS.textLight}
                  value={roomNumber}
                  onChangeText={(text) => {
                    setRoomNumber(text);
                    if (errors.roomNumber) {
                      setErrors({ ...errors, roomNumber: null });
                    }
                  }}
                  keyboardType="numeric"
                />
                {errors.roomNumber && (
                  <Text style={styles.errorText}>{errors.roomNumber}</Text>
                )}
              </View>
            </>
          )}

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Create a password (min 6 characters)"
              placeholderTextColor={COLORS.textLight}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) {
                  setErrors({ ...errors, password: null });
                }
              }}
              secureTextEntry
              autoCapitalize="none"
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={[styles.input, errors.confirmPassword && styles.inputError]}
              placeholder="Re-enter your password"
              placeholderTextColor={COLORS.textLight}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) {
                  setErrors({ ...errors, confirmPassword: null });
                }
              }}
              secureTextEntry
              autoCapitalize="none"
            />
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[styles.signupButton, loading && styles.signupButtonDisabled]}
            onPress={handleSignup}
            disabled={loading}
          >
            <Text style={styles.signupButtonText}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Login Link */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginText}>
              Already have an account?{' '}
              <Text style={styles.loginTextBold}>Login</Text>
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
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
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
  roleSelector: {
    marginBottom: 20,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  roleButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  roleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  roleButtonTextActive: {
    color: COLORS.primary,
  },
  signupButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  signupButtonDisabled: {
    backgroundColor: COLORS.disabled,
  },
  signupButtonText: {
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
  loginButton: {
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  loginTextBold: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
