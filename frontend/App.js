import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import RegisterScreen from "./screens/RegisterScreen";
import PlanScreen from "./screens/PlanScreen";
import ViewPlanScreen from "./screens/ViewPlanScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Register">
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Plan" component={PlanScreen} />
        <Stack.Screen name="ViewPlans" component={ViewPlanScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
