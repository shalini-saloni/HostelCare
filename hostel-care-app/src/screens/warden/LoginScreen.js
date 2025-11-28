import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import Input from '../../components/Input';
import CustomButton from '../../components/CustomButton';
import colors from '../../utils/colors';
import { getData, setData, STORAGE_KEYS } from '../../utils/helpers';

const WardenLoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);

    try {
      // For demo purposes, any email/password works for warden
      // In production, implement proper authentication
      const wardenUser = {
        id: 'warden_1',
        email,
        name: 'Warden Admin',
        role: 'warden',
      };
      
      await setData('@currentUser', wardenUser);
      navigation.replace('WardenTabs');
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.logo}>🛡️</Text>
          <Text style={styles.title}>Warden Login</Text>
          <Text style={styles.subtitle}>Staff Portal</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
          />

          <CustomButton
            title="Login"
            onPress={handleLogin}
            loading={loading}
            variant="secondary"
            style={styles.submitButton}
          />

          <CustomButton
            title="Back to Home"
            onPress={() => navigation.goBack()}
            variant="outline"
          />
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Demo Credentials</Text>
          <Text style={styles.infoText}>Use any email and password to login</Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logo: {
    fontSize: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  form: {
    marginBottom: 40,
  },
  submitButton: {
    marginBottom: 12,
  },
  infoBox: {
    backgroundColor: colors.info + '20',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.info + '40',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default WardenLoginScreen;