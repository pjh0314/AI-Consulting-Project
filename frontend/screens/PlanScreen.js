// frontend/screens/PlanScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
//import payload from "../payload.json"; use example payload for running OpenAI
//import testPlans from "../plans.json"; rfallback test data

export default function PlanScreen({ navigation }) {
  const [planName, setPlanName] = useState("");

  const fetchAndSavePlan = async () => {
    try {
      // Load payload created in PayloadFormScreen
      const storedPayload = await AsyncStorage.getItem("payload");
      if (!storedPayload) {
        Alert.alert("No payload found", "Please create a payload first.");
        return;
      }

      if (!planName.trim()) {
        Alert.alert("Missing Name", "Please enter a name for this plan.");
        return;
      }

      const response = await fetch("http://127.0.0.1:8000/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: storedPayload, // already a string
      });

      if (!response.ok) throw new Error(`Error ${response.status}`);

      const data = await response.json();
      console.log("Received plan:", data);
      
      // Get existing plans from storage
      const existingPlansStr = await AsyncStorage.getItem("plans");
      const existingPlans = existingPlansStr ? JSON.parse(existingPlansStr) : [];

      // Create the new plan object with an ID and name
      const newPlan = {
        id: Date.now().toString(), // Use a timestamp for a simple unique ID
        name: planName,
        daily: data.daily || [],
        weekly: data.weekly || [],
      };

      // Add the new plan to the array and save it back to storage
      const updatedPlans = [...existingPlans, newPlan];
      await AsyncStorage.setItem("plans", JSON.stringify(updatedPlans));

      Alert.alert("Success", `Plan "${planName}" was saved!`, [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);

    } catch (e) {
      console.error("Error fetching from backend:", e);
      Alert.alert("Error", e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter a name for your new plan:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Marathon Prep Week 1"
        value={planName}
        onChangeText={setPlanName}
      />
      <Button title="Generate and Save Plan" onPress={fetchAndSavePlan} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  label: { fontSize: 16, marginBottom: 10 },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: "80%",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});
