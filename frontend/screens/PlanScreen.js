// screens/PlanScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PlanScreen() {
  const [plans, setPlans] = useState([]);

  // List of sample workouts (1–10)
  const workoutPool = [
    "Push Ups 3x15",
    "Squats 3x20",
    "Pull Ups 3x8",
    "Lunges 3x12",
    "Plank 3x60s",
    "Burpees 3x10",
    "Sit Ups 3x25",
    "Jumping Jacks 3x50",
    "Mountain Climbers 3x40",
    "Dips 3x12",
  ];

  // Load all saved plans
  useEffect(() => {
    const loadPlans = async () => {
      try {
        const savedPlans = await AsyncStorage.getItem("plans");
        if (savedPlans) {
          setPlans(JSON.parse(savedPlans));
        }
      } catch (error) {
        console.error("Error loading plans:", error);
      }
    };
    loadPlans();
  }, []);

  // Delete a specific plan
  const deletePlan = async (index) => {
    try {
      const updatedPlans = plans.filter((_, i) => i !== index);
      setPlans(updatedPlans);
      await AsyncStorage.setItem("plans", JSON.stringify(updatedPlans));
    } catch (error) {
      console.error("Error deleting plan:", error);
    }
  };

  // Add a sample plan for testing, when pressing the button at the bottom
  const addDummyPlan = async () => {
    // Pick random workout
    const randomWorkout =
      workoutPool[Math.floor(Math.random() * workoutPool.length)];

    // Randomize week between 1–10
    const randomWeek = Math.floor(Math.random() * 10) + 1;

    const newPlan = {
      week: randomWeek,
      day: 1,
      workout: randomWorkout,
    };

    const updatedPlans = [...plans, newPlan];
    setPlans(updatedPlans);
    await AsyncStorage.setItem("plans", JSON.stringify(updatedPlans));
  };


  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        Saved Plans:
      </Text>

      {plans.length === 0 ? (
        <Text>No plans saved yet.</Text>
      ) : (
        <FlatList
          data={plans}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View
              style={{
                padding: 10,
                marginVertical: 5,
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 5,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text>{`Week ${item.week}, Day ${item.day}: ${item.workout}`}</Text>
              <TouchableOpacity onPress={() => deletePlan(index)}>
                <Text style={{ color: "red" }}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <Button title="Add Dummy Plan" onPress={addDummyPlan} />
    </View>
  );
}
