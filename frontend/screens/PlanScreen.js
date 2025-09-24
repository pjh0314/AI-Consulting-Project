// frontend/screens/PlanScreen.js
import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
//import payload from "../payload.json"; use example payload for running OpenAI
//import testPlans from "../plans.json"; rfallback test data

export default function PlanScreen() {
  const [dailyPlans, setDailyPlans] = useState([]);
  const [weeklyPlans, setWeeklyPlans] = useState([]);

  const fetchFromBackend = async () => {
    try {
      // Load payload created in PayloadFormScreen
      const storedPayload = await AsyncStorage.getItem("payload");
      if (!storedPayload) {
        Alert.alert("No payload found", "Please create a payload first.");
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

      setDailyPlans(data.daily || []);
      setWeeklyPlans(data.weekly || []);

      // 🔹 Save results locally
      await AsyncStorage.setItem("dailyPlans", JSON.stringify(data.daily || []));
      await AsyncStorage.setItem("weeklyPlans", JSON.stringify(data.weekly || []));
    } catch (e) {
      console.error("Error fetching from backend:", e);
      Alert.alert("Error", e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Fetch Plan from Backend" onPress={fetchFromBackend} />
      <Text style={styles.text}>Daily Plans: {dailyPlans.length}</Text>
      <Text style={styles.text}>Weekly Plans: {weeklyPlans.length}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { marginTop: 10, fontSize: 16 },
});


// export default function PlanScreen() {
//   const [dailyPlans, setDailyPlans] = useState([]);
//   const [weeklyPlans, setWeeklyPlans] = useState([]);

//   const fetchFromBackend = async () => {
//     try {
//       const response = await fetch("http://127.0.0.1:8000/test", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),  // same as "curl --data-binary @payload.json" 
//       });

//       if (!response.ok) throw new Error(`Error ${response.status}`);

//       const data = await response.json();
//       console.log("Received plan:", data);

//       setDailyPlans(data.daily || []);
//       setWeeklyPlans(data.weekly || []);

//       await AsyncStorage.setItem("dailyPlans", JSON.stringify(data.daily || []));
//       await AsyncStorage.setItem("weeklyPlans", JSON.stringify(data.weekly || []));
//     } catch (e) {
//       console.error("Error fetching from backend:", e);
//     }
//   };

//   return (
//     <View>
//       <Button title="Fetch Plan" onPress={fetchFromBackend} />
//       <Text>Daily Plans: {dailyPlans.length}</Text>
//       <Text>Weekly Plans: {weeklyPlans.length}</Text>
//     </View>
//   );
// }

  // Load plans from AsyncStorage or fallback
  // useEffect(() => {
  //   async function loadPlans() {
  //     try {
  //       const savedDaily = await AsyncStorage.getItem("dailyPlans");
  //       const savedWeekly = await AsyncStorage.getItem("weeklyPlans");

  //       setDailyPlans(savedDaily ? JSON.parse(savedDaily) : testPlans.daily);
  //       setWeeklyPlans(savedWeekly ? JSON.parse(savedWeekly) : testPlans.weekly);
  //     } catch (e) {
  //       console.error("Error loading plans:", e);
  //     }
  //   }
  //   loadPlans();
  // }, []);

  // Save plans to AsyncStorage
  // const savePlans = async () => {
  //   try {
  //     await AsyncStorage.setItem("dailyPlans", JSON.stringify(dailyPlans));
  //     await AsyncStorage.setItem("weeklyPlans", JSON.stringify(weeklyPlans));
  //     alert("Plans saved!");
  //   } catch (e) {
  //     console.error("Error saving plans:", e);
  //   }
  // };

  // Reload test plans
  // const reloadPlans = () => {
  //   setDailyPlans(testPlans.daily);
  //   setWeeklyPlans(testPlans.weekly);
  // };

  // Fetch from backend FastAPI
  // const fetchFromBackend = async () => {
  //   try {
  //     const response = await fetch("http://127.0.0.1:8000/test", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     if (!response.ok) throw new Error(`Error ${response.status}`);

  //     const data = await response.json();
  //     console.log("Received plan:", data);

  //     // Assume backend returns { daily: [...], weekly: [...] }
  //     setDailyPlans(data.daily || []);
  //     setWeeklyPlans(data.weekly || []);

  //     // Save immediately
  //     await AsyncStorage.setItem("dailyPlans", JSON.stringify(data.daily || []));
  //     await AsyncStorage.setItem("weeklyPlans", JSON.stringify(data.weekly || []));
  //   } catch (e) {
  //     console.error("Error fetching from backend:", e);
  //   }
  // };

//   return (
//     <View style={{ flex: 1 }}>
//       <ScrollView style={styles.scroll}>
//         <Text style={styles.header}>Daily Plans</Text>
//         {dailyPlans.map((day) => (
//           <View key={day.date} style={styles.planBox}>
//             <Text style={styles.planDate}>{day.date}</Text>
//             {day.blocks.map((block, idx) => (
//               <View key={idx} style={styles.blockBox}>
//                 <Text style={styles.blockTitle}>{block.title}</Text>
//                 {block.details.map((d, i) => (
//                   <Text key={i}>
//                     {d.label}: {d.target_value} {d.unit || ""}
//                   </Text>
//                 ))}
//               </View>
//             ))}
//           </View>
//         ))}

//         <Text style={styles.header}>Weekly Plans</Text>
//         {weeklyPlans.map((week) => (
//           <View key={week.week_number} style={styles.planBox}>
//             <Text style={styles.planDate}>Week {week.week_number}</Text>
//             <Text>Theme: {week.theme}</Text>
//             <Text>Notes: {week.notes}</Text>
//             {week.details.map((d, i) => (
//               <Text key={i}>
//                 {d.label}: {d.target_value} {d.unit || ""}
//               </Text>
//             ))}
//           </View>
//         ))}
//       </ScrollView>

//       {/* Buttons */}
//       <View style={styles.buttonRow}>
//         <Button title="Save This Plan" onPress={savePlans} />
//         <Button title="Reload Plan" onPress={reloadPlans} />
//         <Button title="Fetch" onPress={fetchFromBackend} />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   scroll: { padding: 16 },
//   header: { fontSize: 20, fontWeight: "bold", marginTop: 16 },
//   planBox: { marginVertical: 10, padding: 10, borderWidth: 1, borderRadius: 8 },
//   planDate: { fontWeight: "bold", marginBottom: 6 },
//   blockBox: { marginLeft: 10, marginBottom: 6 },
//   blockTitle: { fontWeight: "bold" },
//   buttonRow: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     margin: 10,
//   },
// });
