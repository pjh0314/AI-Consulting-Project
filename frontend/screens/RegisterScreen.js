import React from "react";
import { View, Button, Text } from "react-native";

export default function RegisterScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 16 }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        Testing Plan Display
      </Text>

      {/* ✅ Navigate to PlanScreen */}
      <Button title="Load Plan" onPress={() => navigation.navigate("Plan")} />
      <Button
        title="View Saved Plans"
        onPress={() => navigation.navigate("ViewPlans")}
      />
    </View>
  );
}
