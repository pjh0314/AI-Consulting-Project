import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { register } from "../api/auth";

export default function RegisterScreen({ navigation, plan, savePlan, goToPlan }) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const res = await register(email, fullName, password);
      Alert.alert("Success", `User registered: ${res.email}`);
      navigation.navigate("Login");
    } catch (err) {
      Alert.alert("Error", err.response?.data?.detail || err.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 16 }}>
      <Text>Register</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginVertical: 8, padding: 8 }}
      />
      <TextInput
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
        style={{ borderWidth: 1, marginVertical: 8, padding: 8 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginVertical: 8, padding: 8 }}
      />

      <Button title="Register" onPress={handleRegister} />

      {/* Button to navigate to PlanScreen */}
      <Button
        title="View Saved Plan"
        onPress={() => {
          if (!plan) {
            savePlan(); // save a dummy plan if none exists
          }
          goToPlan(); // navigate to PlanScreen
        }}
      />
    </View>
  );
}
