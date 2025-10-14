/**
 * filename: friend_list_strand.tsx
 * author: Dakota Strand
 * description: friend list screen with add friend functionality
 */

import React, { useState } from "react";
import { View, Text, Button, TextInput, FlatList, StyleSheet } from "react-native";
import { useFriends } from "hooks/use_friends_strand";
import { useRouter } from "expo-router";

export default function FriendListStrand() {
  const { friends, addFriend } = useFriends();
  const [newFriend, setNewFriend] = useState("");
  const router = useRouter();

  return (
    <View style={styles.container}>
      <FlatList
        data={friends}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <Text>{item}</Text>}
      />
      <TextInput
        style={styles.input}
        placeholder="Add friend"
        value={newFriend}
        onChangeText={setNewFriend}
      />
      <Button
        title="Add Friend"
        onPress={() => {
          if (newFriend.trim() !== "") {
            addFriend(newFriend);
            setNewFriend("");
          }
        }}
      />
      <Button title="Timer" onPress={() => router.push("/timer_screen_strand")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  input: { borderWidth: 1, width: "80%", marginVertical: 10, padding: 8 },
});
