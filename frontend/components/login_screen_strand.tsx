// Dakota Strand - Login Screen Component
// Handles user login by collecting email/password and calling useAuth()

import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useAuth } from "../hooks/useAuth";

export default function LoginScreen() {
  // Grab login function from useAuth hook
  const { login } = useAuth();

  // State variables with TypeScript typing
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BackTrack Login</Text>

      {/* Input for email */}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      {/* Input for password */}
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      {/* Button calls login function */}
      <Button title="Login" onPress={() => login(email, password)} />
    </View>
  );
}

// Simple styling for layout
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 5 },
});
