import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useFriends } from "hooks/useFriends";
import { useRouter } from "expo-router";

export default function FriendsList() {
  const { friends, addFriend, removeFriend, toggleFavorite } = useFriends();
  const [newFriend, setNewFriend] = useState("");
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const router = useRouter();

  const handleSelectFriend = (name: string) => {
    setSelectedFriends((prev) =>
      prev.includes(name) ? prev.filter((f) => f !== name) : [...prev, name]
    );
  };

  const handleNotify = () => {
    if (selectedFriends.length === 0) {
      Alert.alert("Select at least one friend to notify.");
      return;
    }
    Alert.alert(`Friends notified: ${selectedFriends.join(", ")}`);
    router.replace("/tabs/timer"); // go back to timer
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Friends</Text>

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
            <View style={styles.friendButtons}>
              <Button
                title={item.favorite ? "Unfavorite" : "Favorite"}
                onPress={() => toggleFavorite(item.name)}
                color="green"
              />
              <Button
                title="Remove"
                onPress={() => removeFriend(item.name)}
                color="darkgreen"
              />
            </View>
          </TouchableOpacity>
        )}
      />

      <TextInput
        style={styles.input}
        placeholder="Add friend"
        placeholderTextColor="#c0f0b3"
        value={newFriend}
        onChangeText={setNewFriend}
      />
      <Button
        title="Add Friend"
        onPress={() => {
          if (newFriend.trim() !== "") {
            addFriend(newFriend.trim());
            setNewFriend("");
          }
        }}
        color="green"
      />

      <Button title="Notify Selected Friends" onPress={handleNotify} color="green" />
      <Button title="Back to Timer" onPress={() => router.replace("/tabs/timer")} color="darkgreen" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b2d0b", // dark green background
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginTop: 40,
    marginBottom: 10,
    alignSelf: "center",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedFriend: {
    backgroundColor: "#006400", // darker green when selected
  },
  friendText: {
    color: "white",
    fontSize: 18,
  },
  friendButtons: {
    flexDirection: "row",
    gap: 5,
  },
});
