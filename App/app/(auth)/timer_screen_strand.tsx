/**
 * filename: timer_screen_strand.tsx
 * author: Dakota Strand
 * description: Timer screen where user sets destination, duration, selects friends, and gets notifications
 */

import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTimer } from "hooks/use_timer_strand";
import { useFriends } from "hooks/use_friends_strand";

export default function TimerScreenStrand() {
  const { time, startTimer, stopTimer, resetTimer } = useTimer();
  const { friends } = useFriends();
  const router = useRouter();

  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState(""); // duration in minutes
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [running, setRunning] = useState(false);

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

    startTimer(Number(duration) * 60); // convert minutes to seconds
    setRunning(true);
    Alert.alert("Timer started", `Your friends will be notified if you don't check in!`);
  };

  const handleStop = () => {
    stopTimer();
    setRunning(false);
  };

  const handleReset = () => {
    resetTimer();
    setRunning(false);
  };

  useEffect(() => {
    if (running && time <= 0) {
      Alert.alert(
        "Time's up!",
        `You didn't check in from "${destination}" on time. Notifying friends: ${selectedFriends.join(", ")}`
      );
      handleReset();
    }
  }, [time]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BackTrack Timer</Text>

      <TextInput
        style={styles.input}
        placeholder="Where are you going?"
        placeholderTextColor="#c0f0b3"
        value={destination}
        onChangeText={setDestination}
      />

      <TextInput
        style={styles.input}
        placeholder="Duration (minutes)"
        placeholderTextColor="#c0f0b3"
        value={duration}
        onChangeText={setDuration}
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

      <Text style={styles.timerText}>{running ? `${time}s remaining` : "Timer not running"}</Text>

      <View style={styles.buttons}>
        <Button title="Start" onPress={handleStart} color="green" />
        <Button title="Stop" onPress={handleStop} color="darkgreen" />
        <Button title="Reset" onPress={handleReset} color="green" />
        <Button title="Friends List" onPress={() => router.push("/friend_list_strand")} color="darkgreen" />
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
