import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
// Placeholder for Firebase Auth (will be implemented in Phase 4)
import { onAuthStateChanged } from 'firebase/auth'; 

import AuthStack from './AuthStack';
import StudentTabs from './StudentTabs';
import WardenTabs from './WardenTabs';

// Placeholder imports (assuming these files exist)
import { auth } from '../services/firebaseConfig'; 
import colors from '../utils/colors';

// Placeholder function to fetch user role (Phase 4 task)
const getUserRole = async (uid) => {
    // Simulating role fetch. In a real app, this reads from the 'users' collection.
    if (uid && uid.endsWith('001')) {
        return 'warden';
    }
    return 'student'; // Default role
};

/**
 * The main navigator that controls the entire application flow (Auth vs. App).
 */
const AppNavigator = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  // Handle user state changes (Firebase Auth Listener)
  useEffect(() => {
    // Placeholder sign-in logic for development until Phase 4 is complete
    // In a real app, you must handle the __initial_auth_token logic here.

    const subscriber = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch User Role
        const userRole = await getUserRole(currentUser.uid);
        setRole(userRole);
      } else {
        setRole(null);
      }
      if (initializing) setInitializing(false);
    });
    return subscriber; // unsubscribe on unmount
  }, [initializing]);

  // Show Loading State
  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.PRIMARY} />
      </View>
    );
  }

  // Render Navigation based on Auth/Role
  let MainScreen;
  if (!user) {
    MainScreen = AuthStack;
  } else if (role === 'warden') {
    MainScreen = WardenTabs;
  } else {
    MainScreen = StudentTabs;
  }

  return (
    <NavigationContainer>
      <MainScreen />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.WHITE,
    }
});

export default AppNavigator;