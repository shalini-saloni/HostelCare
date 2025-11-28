import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import Input from '../../components/Input';
import CustomButton from '../../components/CustomButton';
import colors from '../../utils/colors';
import { getData, setData, STORAGE_KEYS } from '../../utils/helpers';

const StudentLoginScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (!isLogin && (!name || !roomNumber)) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);

    try {
      const users = await getData(STORAGE_KEYS.USER) || [];

      if (isLogin) {
        // Login
        const user = users.find(u => u.email === email && u.password === password && u.role === 'student');
        if (user) {
          await setData('@currentUser', user);
          navigation.replace('StudentTabs');
        } else {
          Alert.alert('Error', 'Invalid credentials');
        }
      } else {
        // Signup
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
          Alert.alert('Error', 'Email already registered');
        } else {
          const newUser = {
            id: 'student_' + Date.now(),
            email,
            password,
            name,
            roomNumber,
            role: 'student',
          };
          users.push(newUser);
          await setData(STORAGE_KEYS.USER, users);
          await setData('@currentUser', newUser);
          Alert.alert('Success', 'Account created successfully!');
          navigation.replace('StudentTabs');
        }
      }
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
          <Text style={styles.logo}>🎓</Text>
          <Text style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>
          <Text style={styles.subtitle}>Student Portal</Text>
        </View>

        <View style={styles.form}>
          {!isLogin && (
            <>
              <Input
                label="Full Name"
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
              />
              <Input
                label="Room Number"
                value={roomNumber}
                onChangeText={setRoomNumber}
                placeholder="e.g. 204"
                keyboardType="numeric"
              />
            </>
          )}
          
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
            title={isLogin ? 'Login' : 'Sign Up'}
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />

          <CustomButton
            title={isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
            onPress={() => setIsLogin(!isLogin)}
            variant="outline"
          />

          <CustomButton
            title="Back to Home"
            onPress={() => navigation.goBack()}
            variant="outline"
            style={styles.backButton}
          />
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
  backButton: {
    marginTop: 12,
  },
});

export default StudentLoginScreen;