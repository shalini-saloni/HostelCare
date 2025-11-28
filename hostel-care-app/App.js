import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { initializeMockData } from './src/utils/helpers';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import StudentLoginScreen from './src/screens/student/LoginScreen';
import WardenLoginScreen from './src/screens/warden/LoginScreen';

// Student Tabs
import StudentTabs from './src/navigation/StudentTabs';
// Warden Tabs
import WardenTabs from './src/navigation/WardenTabs';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    // Initialize mock data on app start
    initializeMockData();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="StudentLogin" component={StudentLoginScreen} />
        <Stack.Screen name="WardenLogin" component={WardenLoginScreen} />
        <Stack.Screen name="StudentTabs" component={StudentTabs} />
        <Stack.Screen name="WardenTabs" component={WardenTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}