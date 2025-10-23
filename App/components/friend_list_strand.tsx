// Dakota Strand - Friend List Component
// Displays the user’s list of friends and allows adding/removing

import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";
import { useFriends } from "./use_friends_strand";

export default function FriendListScreen() {
  const { friends, addFriend, removeFriend } = useFriends();

  const [newFriend, setNewFriend] = useState<string>("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Friends</Text>

      {/* Display list of friends */}
      <FlatList
        data={friends}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.friendItem}>
            <Text>{item}</Text>
            <Button title="Remove" onPress={() => removeFriend(item)} />
          </View>
        )}
      />

      {/* Add new friend input */}
      <TextInput
        placeholder="Enter friend's name"
        value={newFriend}
        onChangeText={setNewFriend}
        style={styles.input}
      />
      <Button
        title="Add Friend"
        onPress={() => {
          addFriend(newFriend);
          setNewFriend("");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  friendItem: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  input: { borderWidth: 1, marginVertical: 10, padding: 8, borderRadius: 5 },
});
