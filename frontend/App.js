import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import PlanScreen from "./screens/PlanScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      // ✅ Check if user is registered
      const registeredUser = await AsyncStorage.getItem("user");
      if (registeredUser) {
        setIsRegistered(true);
      }
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return null; // You could add a splash screen here
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isRegistered ? "Login" : "Register"}>
        <Stack.Screen name="Register">
          {(props) => (
            <RegisterScreen
              {...props}
              goToPlan={() => props.navigation.navigate("Plan")}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Plan" component={PlanScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
