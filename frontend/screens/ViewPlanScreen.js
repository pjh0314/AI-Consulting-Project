import React, { useState, useEffect } from "react";
import { View, Text, Button, ScrollView, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ViewPlanScreen() {
  const [dailyPlans, setDailyPlans] = useState([]);
  const [weeklyPlans, setWeeklyPlans] = useState([]);
  
  // Load saved plans from AsyncStorage when screen is opened
  useEffect(() => {
    loadSavedPlans();
  }, []);

  const loadSavedPlans = async () => {
    try {
      const savedDaily = await AsyncStorage.getItem("dailyPlans");
      const savedWeekly = await AsyncStorage.getItem("weeklyPlans");

      setDailyPlans(savedDaily ? JSON.parse(savedDaily) : []);
      setWeeklyPlans(savedWeekly ? JSON.parse(savedWeekly) : []);
    } catch (e) {
      console.error("Error loading saved plans:", e);
    }
  };

  // Delete a plan (daily or weekly) and update AsyncStorage
  const deletePlan = async (type, key) => {
    Alert.alert("Delete Plan", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          let newPlans;
          if (type === "daily") {
            // Filter out the plan with matching date
            newPlans = dailyPlans.filter((p) => p.date !== key);
            setDailyPlans(newPlans);
            await AsyncStorage.setItem("dailyPlans", JSON.stringify(newPlans));
          } else {
            // Filter out the plan with matching week number
            newPlans = weeklyPlans.filter((p) => p.week_number !== key);
            setWeeklyPlans(newPlans);
            await AsyncStorage.setItem("weeklyPlans", JSON.stringify(newPlans));
          }
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={{ padding: 16 }}
    >
      {/* Daily Plans */}
      <Text style={styles.header}>Saved Daily Plans</Text>
      {dailyPlans.length === 0 && <Text>No saved daily plans.</Text>}
      {dailyPlans.map((day) => (
        <View key={day.date} style={styles.planBox}>
          <Text style={styles.planDate}>{day.date}</Text>
          {day.blocks.map((block, idx) => (
            <View key={idx} style={styles.blockBox}>
              <Text style={styles.blockTitle}>{block.title}</Text>
              <Text>Category: {block.category}</Text>
              <Text>Duration: {block.duration_min} min</Text>
              {block.details.map((d, i) => (
                <Text key={i}>
                  • {d.label}: {d.target_value} {d.unit || ""}
                </Text>
              ))}
            </View>
          ))}
          <Button title="Delete" onPress={() => deletePlan("daily", day.date)} />
        </View>
      ))}

      {/* Weekly Plans */}
      <Text style={styles.header}>Saved Weekly Plans</Text>
      {weeklyPlans.length === 0 && <Text>No saved weekly plans.</Text>}
      {weeklyPlans.map((week) => (
        <View key={week.week_number} style={styles.planBox}>
          <Text style={styles.planDate}>Week {week.week_number}</Text>
          <Text>Theme: {week.theme}</Text>
          <Text>Notes: {week.notes}</Text>
          {week.details.map((d, i) => (
            <Text key={i}>
              • {d.label}: {d.target_value} {d.unit || ""}
            </Text>
          ))}
          <Button
            title="Delete"
            onPress={() => deletePlan("weekly", week.week_number)}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  header: { fontSize: 20, fontWeight: "bold", marginTop: 16 },
  planBox: { marginVertical: 10, padding: 10, borderWidth: 1, borderRadius: 8 },
  planDate: { fontWeight: "bold", marginBottom: 6 },
  blockBox: { marginLeft: 10, marginBottom: 6 },
  blockTitle: { fontWeight: "bold", fontSize: 16 },
});
