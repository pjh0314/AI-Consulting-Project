import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import PlanScreen from "./screens/PlanScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [plan, setPlan] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      // Load saved plan
      const savedPlan = await AsyncStorage.getItem("plan");
      if (savedPlan) setPlan(JSON.parse(savedPlan));

      // Check if user is registered
      const registeredUser = await AsyncStorage.getItem("user");
      if (registeredUser) {
        setIsRegistered(true);
      }

      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return null; // You could return a splash/loading screen here
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isRegistered ? "Login" : "Register"}>
        <Stack.Screen name="Register">
          {(props) => (
            <RegisterScreen
              {...props}
              plan={plan}
              goToPlan={() => props.navigation.navigate("Plan")}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Login">
          {(props) => <LoginScreen {...props} plan={plan} />}
        </Stack.Screen>

        <Stack.Screen name="Plan" component={PlanScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
