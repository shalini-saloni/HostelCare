import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./src/screens/student/HomeScreen";
import ComplaintCard from "./src/components/ComplaintCard";
import AddComplaint from "./src/screens/student/AddComplaint";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: "Home" }}
        />
        <Stack.Screen 
          name="AddComplaint" 
          component={AddComplaint} 
          options={{ title: "Add Complaint" }}
        />
        <Stack.Screen 
          name="ComplaintDetails" 
          component={ComplaintCard} 
          options={{ title: "Complaint Details" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
