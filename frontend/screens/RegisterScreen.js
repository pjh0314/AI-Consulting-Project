import React from "react";
import { View, Button, Text } from "react-native";

export default function RegisterScreen({ goToPlan }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 16 }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        Testing AsyncStorage
      </Text>

      {/* ✅ Button just navigates to PlanScreen */}
      <Button
        title="View Saved Plans"
        onPress={goToPlan}
      />
    </View>
  );
}
