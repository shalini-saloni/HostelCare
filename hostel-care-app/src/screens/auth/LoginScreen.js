/**
 * LOGIN SCREEN (SAFE VERSION)
 */

import { useState } from "react";
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
} from "react-native";
import { StatusBar } from "expo-status-bar";

// SAFE COLOR IMPORT
import rawColors from "../../utils/colors";

const DEFAULTS = {
  background: "#FFFFFF",
  textPrimary: "#000000",
  textSecondary: "#666666",
  textLight: "#999999",
  primary: "#1E90FF",
  white: "#FFFFFF",
  border: "#DDDDDD",
  error: "#FF3B30",
  disabled: "#AFAFAF",
};

// Merge defaults with user colors safely
const C = { ...DEFAULTS, ...(rawColors || {}) };

import { validateEmail, validatePassword } from "../../utils/helpers";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(email)) newErrors.email = "Enter a valid email";

    if (!password) newErrors.password = "Password is required";
    else {
      const result = validatePassword(password);
      if (!result.isValid) newErrors.password = result.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      await new Promise((res) => setTimeout(res, 1500));
      Alert.alert("Success", "Login successful!");
    } catch (err) {
      Alert.alert("Login Failed", err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Login to your HostelCare account</Text>
        </View>

        <View style={styles.form}>
          {/* EMAIL */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Enter your email"
              placeholderTextColor={C.textLight}
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                if (errors.email) setErrors({ ...errors, email: null });
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          {/* PASSWORD */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Enter your password"
              placeholderTextColor={C.textLight}
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                if (errors.password) setErrors({ ...errors, password: null });
              }}
              secureTextEntry
              autoCapitalize="none"
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          {/* LOGIN BTN */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>

          {/* SIGNUP */}
          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => navigation?.navigate("Signup")}
          >
            <Text style={styles.signupText}>
              Don't have an account?{" "}
              <Text style={styles.signupTextBold}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ===================== STYLES (SAFE) =====================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: C.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: C.textSecondary,
  },
  form: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: C.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: C.textPrimary,
  },
  inputError: {
    borderColor: C.error,
  },
  errorText: {
    color: C.error,
    fontSize: 12,
    marginTop: 4,
  },
  loginButton: {
    backgroundColor: C.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  loginButtonDisabled: {
    backgroundColor: C.disabled,
  },
  loginButtonText: {
    color: C.white,
    fontSize: 16,
    fontWeight: "600",
  },
  signupButton: {
    alignItems: "center",
    marginTop: 24,
  },
  signupText: {
    fontSize: 14,
    color: C.textSecondary,
  },
  signupTextBold: {
    color: C.primary,
    fontWeight: "600",
  },
});
