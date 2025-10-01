import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

export default function ViewPlanScreen({ navigation }) {
  const [plans, setPlans] = useState([]);
  const isFocused = useIsFocused(); // This hook reloads data when the screen is focused

  useEffect(() => {
    if (isFocused) {
      loadSavedPlans();
    }
  }, [isFocused]);

  const loadSavedPlans = async () => {
    try {
      const savedPlans = await AsyncStorage.getItem("plans");
      setPlans(savedPlans ? JSON.parse(savedPlans) : []);
    } catch (e) {
      console.error("Error loading saved plans:", e);
    }
  };

  const renderPlanItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.planBox}
        onPress={() => navigation.navigate("PlanDetailScreen", { plan: item })}
      >
        <Text style={styles.planName}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={plans}
      renderItem={renderPlanItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16 }}
      ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20}}>No saved plans yet.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  planBox: {
    marginVertical: 8,
    padding: 20,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
  },
  planName: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
