import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import RegisterScreen from "./screens/RegisterScreen";
import PlanScreen from "./screens/PlanScreen";
import ViewPlanScreen from "./screens/ViewPlanScreen";
import PayloadFormScreen from "./screens/PayloadFormScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="RegisterScreen">
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ title: "Home" }} />
        <Stack.Screen name="PayloadFormScreen" component={PayloadFormScreen} options={{ title: "Build Payload" }} />
        <Stack.Screen name="PlanScreen" component={PlanScreen} options={{ title: "Add Plans" }} />
        <Stack.Screen name="ViewPlanScreen" component={ViewPlanScreen} options={{ title: "View Plan" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 