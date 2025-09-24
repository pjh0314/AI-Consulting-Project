import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@my_fitness_plans";

export default function ViewPlanScreen() {
  const [plans, setPlans] = useState([]);

  // Load saved plans on mount
  useEffect(() => {
    const loadPlans = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setPlans(JSON.parse(saved));
        }
      } catch (err) {
        console.error("Error loading plans:", err);
      }
    };

    loadPlans();
  }, []);

  // Delete a plan by index
  const deletePlan = async (index) => {
    Alert.alert(
      "Delete Plan",
      "Are you sure you want to delete this plan?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const updated = [...plans];
              updated.splice(index, 1);
              await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
              setPlans(updated);
            } catch (err) {
              console.error("Error deleting plan:", err);
            }
          },
        },
      ]
    );
  };

  if (plans.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No plans saved yet.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
        Saved Plans
      </Text>

      <FlatList
        data={plans}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View
            style={{
              padding: 12,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "600" }}>
              {item.weekly[0]?.theme || "No theme"}
            </Text>
            <Text style={{ marginBottom: 8 }}>
              Weeks: {item.weekly.length}, Days: {item.daily.length}
            </Text>

            <Button
              title="Delete Plan"
              color="red"
              onPress={() => deletePlan(index)}
            />
          </View>
        )}
      />
    </View>
  );
}
