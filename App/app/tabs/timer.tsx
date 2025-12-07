// Dakota Strand - Timer Screen Component
// Allows user to set, extend, and cancel safety timers

import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Button, StyleSheet, Alert, TextInput, FlatList, TouchableOpacity } from "react-native";
import { useTimer } from "hooks/useTimer";
import { useFriends } from "hooks/useFriends";
import { useSession } from "hooks/useSession";


export default function TimerScreen() {
  const { remainingSeconds, status, startTimer, extendTimer, cancelTimer } = useTimer();
  const { friends } = useFriends();
  const { username } = useSession();
  const [duration, setDuration] = useState<number>(0.1); // Default timer: 5 minutes
  const [destination, setDestination] = useState("");
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  const selectedFriendUsernames = useMemo(
    () => selectedFriends.map((f) => f.toLowerCase()),
    [selectedFriends]
  );

  const handleSelectFriend = (name: string) => {
    setSelectedFriends((prev) =>
      prev.includes(name) ? prev.filter((f) => f !== name) : [...prev, name]
    );
  };

const handleStart = () => {
  if (!destination.trim()) {
    Alert.alert("Please enter a destination.");
    return;
  }
  if (!duration || isNaN(Number(duration)) || Number(duration) <= 0) {
    Alert.alert("Please enter a valid duration in minutes.");
    return;
  }
  if (selectedFriends.length === 0) {
    Alert.alert("Select at least one friend to notify.");
    return;
  }
  if (!username) {
    Alert.alert("Error", "No logged-in username found.");
    return;
  }

  const started = startTimer(duration, selectedFriendUsernames, destination, username);

  if (!started) {
    Alert.alert("Connection issue", "Unable to start timer because the socket is not connected.");
    return;
  }

  Alert.alert(
    "Timer started",
    `Your friends will be notified if you don't check in!`
  );
};

const handleCancel = () => {
  if (!username) {
    Alert.alert("Error", "No logged-in username found.");
    return;
  }

  cancelTimer(username, selectedFriendUsernames, destination);
};

  useEffect(() => {
    if (status === "expired") {
      Alert.alert(
        "Time's up!",
        `You didn't check in from "${destination}" on time. Notifying friends: ${selectedFriends.join(", ")}`
      );
    }
  }, [status, destination, selectedFriends]);

  const formattedRemaining = useMemo(() => {
    if (status === "expired") return "Timer expired";
    if (remainingSeconds === null) return "Timer not running";
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")} remaining`;
  }, [remainingSeconds, status]);

  return (
     <View style={styles.container}>
       <Text style={styles.title}>BackTrack Timer</Text>
 
       <TextInput
         style={styles.input}
         placeholder="Where are you going?"
         placeholderTextColor="#c0f0b3"
         value={destination}
         onChangeText={(newDestination) => setDestination(newDestination)}
       />
 
       <TextInput
         style={styles.input}
         placeholder="Duration (minutes)"
         placeholderTextColor="#c0f0b3"
         onChangeText={(newDuration) => setDuration(Number(newDuration))}
         keyboardType="numeric"
       />
 
       <Text style={styles.subtitle}>Select Friends to Notify:</Text>
       <FlatList
         data={friends}
         keyExtractor={(item) => item.name}
         renderItem={({ item }) => (
           <TouchableOpacity
             style={[
               styles.friendItem,
               selectedFriends.includes(item.name) && styles.selectedFriend,
             ]}
             onPress={() => handleSelectFriend(item.name)}
           >
             <Text style={styles.friendText}>
               {item.name} {item.favorite ? "★" : ""}
             </Text>
           </TouchableOpacity>
         )}
       />
 
       <Text style={styles.timerText}>{formattedRemaining}</Text>
 
       <View style={styles.buttons}>
         <Button title="Start" onPress={handleStart} color="green" />
         <Button title="Cancel" onPress={handleCancel} color="darkgreen" />
         <Button
           title="Extend"
           onPress={() => {
             if (!username) {
               Alert.alert("Error", "No logged-in username found.");
               return;
             }
             const extended = extendTimer(5, username);
             if (!extended) {
               Alert.alert("Cannot extend", "Start the timer first or check your connection.");
             }
           }}
           color="green"
         />
       </View>
     </View>
   );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b2d0b",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    alignSelf: "center",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 18,
    color: "white",
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    color: "white",
  },
  friendItem: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 5,
  },
  selectedFriend: {
    backgroundColor: "#006400",
  },
  friendText: {
    color: "white",
    fontSize: 16,
  },
  timerText: {
    fontSize: 20,
    color: "white",
    marginVertical: 10,
    alignSelf: "center",
  },
  buttons: {
    marginTop: 10,
    flexDirection: "column",
    gap: 10,
  },
});
