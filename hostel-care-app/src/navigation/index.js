import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import StudentTabs from "./StudentTabs";
import WardenTabs from "./WardenTabs";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Landing" component={HomeScreen} />

      {/* STUDENT APP */}
      <Stack.Screen name="StudentTabs" component={StudentTabs} />

      {/* WARDEN APP */}
      <Stack.Screen name="WardenTabs" component={WardenTabs} />
    </Stack.Navigator>
  );
}
