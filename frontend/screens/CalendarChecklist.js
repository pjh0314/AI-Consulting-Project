// frontend/screens/CalendarChecklist.js
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Calendar } from "react-native-calendars";

export default function CalendarChecklist() {
  const [dailyPlans, setDailyPlans] = useState([]);
  const [weeklyPlans, setWeeklyPlans] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [viewMode, setViewMode] = useState("daily"); // 'daily' | 'weekly'
  const [checklist, setChecklist] = useState({ daily: {}, weekly: {} });

  // Load plans from AsyncStorage
  useEffect(() => {
    const loadPlans = async () => {
      try {
        const storedDaily = await AsyncStorage.getItem("dailyPlans");
        const storedWeekly = await AsyncStorage.getItem("weeklyPlans");

        setDailyPlans(storedDaily ? JSON.parse(storedDaily) : []);
        setWeeklyPlans(storedWeekly ? JSON.parse(storedWeekly) : []);
      } catch (err) {
        console.error("Error loading plans:", err);
      }
    };

    loadPlans();
  }, []);

  // Toggle check for daily or weekly
  const toggleCheck = (type, blockIdx, detailIdx) => {
    setChecklist((prev) => {
      const newChecks = { ...prev };
      if (!newChecks[type]) newChecks[type] = {};
      if (!newChecks[type][blockIdx]) newChecks[type][blockIdx] = {};
      newChecks[type][blockIdx][detailIdx] = !newChecks[type][blockIdx][detailIdx];
      return newChecks;
    });
  };

  // Filter tasks to show
  const tasksToShow =
    viewMode === "daily"
      ? dailyPlans.find((d) => d.date === selectedDate)?.blocks || []
      : weeklyPlans.map((week) => ({
          title: week.theme,
          details: week.details || [],
        }));

  // Calculate progress
  const progress =
    tasksToShow.length === 0
      ? 0
      : Math.round(
          tasksToShow.reduce((doneCount, block, bIdx) => {
            const blockDetails = block.details || [];
            const checked = blockDetails.filter(
              (_, dIdx) => checklist[viewMode]?.[bIdx]?.[dIdx]
            ).length;
            return doneCount + checked;
          }, 0) /
            tasksToShow.reduce((total, block) => total + (block.details?.length || 0), 0) *
            100
        );

  // Category color
  const getCategoryColor = (category) => {
    switch (category) {
      case "workout":
        return "#f05454";
      case "nutrition":
        return "#30475e";
      case "recovery":
        return "#3da5d9";
      case "habit":
        return "#f5a623";
      default:
        return "#999";
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Calendar */}
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: "#00adf5" },
        }}
        style={{ marginBottom: 10 }}
      />

      {/* Navigation bar */}
      <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 10 }}>
        {["daily", "weekly"].map((mode) => (
          <TouchableOpacity
            key={mode}
            onPress={() => setViewMode(mode)}
            style={[
              styles.navButton,
              viewMode === mode && styles.navButtonSelected,
            ]}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>{mode.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Progress */}
      <Text style={{ textAlign: "center", marginBottom: 10 }}>Progress: {progress}%</Text>

      {/* Checklist */}
      <ScrollView style={{ flex: 1, paddingHorizontal: 10 }}>
        {tasksToShow.map((block, bIdx) => (
          <View key={bIdx} style={{ marginBottom: 10 }}>
            <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
              {viewMode === "daily" ? block.title : block.title}
            </Text>
            {(block.details || []).map((d, dIdx) => (
              <TouchableOpacity
                key={dIdx}
                style={[
                  styles.checkItem,
                  { borderLeftColor: getCategoryColor(d.category) },
                ]}
                onPress={() => toggleCheck(viewMode, bIdx, dIdx)}
              >
                <Text>
                  {checklist[viewMode]?.[bIdx]?.[dIdx] ? "✅" : "⬜"} {d.label}{" "}
                  {d.unit ? `(${d.target_value} ${d.unit})` : ""}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  navButton: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: "gray",
    borderRadius: 6,
  },
  navButtonSelected: {
    backgroundColor: "#00adf5",
  },
  checkItem: {
    borderLeftWidth: 5,
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
  },
});
