/**
 * filename: login_screen_strand.tsx
 * author: Dakota Strand
 * description: login screen for authentication
 */

import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "hooks/use_auth_strand";

export default function LoginScreenStrand() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter username"
        value={username}
        onChangeText={setUsername}
      />
      <Button
        title="Login"
        onPress={() => {
          if (username.trim() !== "") {
            login(username);
            router.push("/timer_screen_strand");
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, marginBottom: 10 },
  input: { borderWidth: 1, width: "80%", margin: 10, padding: 8 },
});
