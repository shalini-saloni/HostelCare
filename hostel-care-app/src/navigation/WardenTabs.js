import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getHeaderTitle } from '@react-navigation/elements';
import { Appbar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import DashboardScreen from '../screens/staff/DashboardScreen'; // Renamed to staff/DashboardScreen
import ManageComplaintsScreen from '../screens/staff/ManageComplaintsScreen';
import InsightsScreen from '../screens/staff/InsightsScreen';
import ProfileScreen from '../screens/common/ProfileScreen'; 

import colors from '../utils/colors';

const Tab = createBottomTabNavigator();

const CustomHeader = ({ navigation, route, options }) => {
  const title = getHeaderTitle(options, route.name);
  
  return (
    <Appbar.Header style={{ backgroundColor: colors.PRIMARY }}>
      <Appbar.Content title={title} color={colors.WHITE} />
    </Appbar.Header>
  );
};

const WardenTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="WardenDashboard"
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.PRIMARY,
        tabBarInactiveTintColor: colors.GREY,
        tabBarStyle: {
          backgroundColor: colors.WHITE,
          borderTopWidth: 1,
          borderTopColor: colors.BORDER,
        },
        header: (props) => <CustomHeader {...props} />,
      })}
    >
      <Tab.Screen 
        name="WardenDashboard" 
        component={DashboardScreen} 
        options={{
          title: 'Warden Dashboard',
          tabBarLabel: 'Overview',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="ManageComplaints" 
        component={ManageComplaintsScreen} 
        options={{
          title: 'Manage Tickets',
          tabBarLabel: 'Manage',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="briefcase-edit-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Insights" 
        component={InsightsScreen} 
        options={{
          title: 'Hostel Stats',
          tabBarLabel: 'Insights',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-bar" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="WardenProfile" 
        component={ProfileScreen} 
        options={{
          title: 'My Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-circle-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default WardenTabs;