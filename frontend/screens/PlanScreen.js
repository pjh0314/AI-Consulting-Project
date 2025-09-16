// screens/PlanScreen.js
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PlanScreen() {
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    const loadPlan = async () => {
      const savedPlan = await AsyncStorage.getItem("userplan");
      if (savedPlan) setPlan(JSON.parse(savedPlan));
    };
    loadPlan();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 16 }}>
      <Text>Saved Plan:</Text>
      {plan ? <Text>{JSON.stringify(plan, null, 2)}</Text> : <Text>No plan saved yet.</Text>}
    </View>
  );
}
