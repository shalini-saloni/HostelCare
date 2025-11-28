import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getHeaderTitle } from '@react-navigation/elements';
import { Appbar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; 

import HomeScreen from '../screens/student/HomeScreen'; 
import AddComplaint from '../screens/student/AddComplaint'; 
import MyComplaintsScreen from '../screens/student/MyComplaintsScreen'; 
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

const StudentTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="StudentHome"
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
        name="StudentHome" 
        component={HomeScreen} 
        options={{
          title: 'Hostel Dashboard',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="CreateComplaint" 
        component={AddComplaint} 
        options={{
          title: 'Raise Complaint',
          tabBarLabel: 'Add',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="plus-circle" color={color} size={size + 4} />
          ),
        }}
      />
      <Tab.Screen 
        name="MyComplaints" 
        component={MyComplaintsScreen} 
        options={{
          title: 'My Reports',
          tabBarLabel: 'My Reports',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="format-list-checks" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="StudentProfile" 
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

export default StudentTabs;