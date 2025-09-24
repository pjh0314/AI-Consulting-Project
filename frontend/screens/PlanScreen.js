import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import payload from "../src/payload.json";

const STORAGE_KEY = "@my_fitness_plans";

export default function PlanScreen() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPlan(data);
      } catch (err) {
        console.error("Error fetching plan:", err);
        Alert.alert("Error", "Failed to fetch plan from backend. Using sample plan.");
        // fallback if needed
        // setPlan(samplePlan);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, []);

  // Save plan locally
  const savePlan = async () => {
    try {
      const savedPlans = await AsyncStorage.getItem(STORAGE_KEY);
      let plansArray = savedPlans ? JSON.parse(savedPlans) : [];
      if (!Array.isArray(plansArray)) plansArray = [];

      plansArray.push(plan);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(plansArray));
      Alert.alert("Saved", "Plan saved locally!");
    } catch (err) {
      console.error("Error saving plan:", err);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Generating Personalized Workout Plan...</Text>
      </View>
    );
  }

  if (!plan) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No plan available.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Button title="Save Plan Locally" onPress={savePlan} />

      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
        Weekly Plan
      </Text>

      <FlatList
        data={plan.weekly}
        keyExtractor={(item) => item.week_number.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "600" }}>
              Week {item.week_number}: {item.theme}
            </Text>
            <Text style={{ marginBottom: 8 }}>{item.notes}</Text>
            {item.details.map((d, idx) => (
              <Text key={idx}>
                • {d.label} {d.target_value ? `- ${d.target_value}` : ""}
              </Text>
            ))}
          </View>
        )}
      />

      <Text style={{ fontSize: 22, fontWeight: "bold", marginVertical: 10 }}>
        Daily Plan
      </Text>

      <FlatList
        data={plan.daily}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 5 }}>
              {item.date}
            </Text>
            {item.blocks.map((block, idx) => (
              <View key={idx} style={{ marginBottom: 8 }}>
                <Text style={{ fontWeight: "500" }}>
                  {block.title} ({block.category}, {block.duration_min} min)
                </Text>
                {block.details.map((d, j) => (
                  <Text key={j}>
                    • {d.label} {d.target_value ? `- ${d.target_value}` : ""}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}
      />
    </View>
  );
}
