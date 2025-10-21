/**
 * filename: login_screen_strand.tsx
 * author: Dakota Strand
 * description: login and signup screen for authentication with forgot password
 */

import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "hooks/use_auth_strand";

export default function LoginScreenStrand() {
  const { login } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false); // toggle between login and signup

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert("Please fill in username and password.");
      return;
    }
    login(username);
    router.push("/timer_screen_strand");
  };

  const handleSignUp = () => {
    if (!username || !password) {
      Alert.alert("Please fill in username and password.");
      return;
    }
    // For now, just treat signup same as login
    login(username);
    router.push("/timer_screen_strand");
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Forgot Password",
      "Password reset instructions would be sent to your email."
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to BackTrack</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#c0f0b3"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#c0f0b3"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {isSignUp ? (
        <Button title="Sign Up" onPress={handleSignUp} color="green" />
      ) : (
        <Button title="Login" onPress={handleLogin} color="green" />
      )}

      <View style={styles.bottomButtons}>
        <Button
          title={isSignUp ? "Switch to Login" : "Switch to Sign Up"}
          onPress={() => setIsSignUp(!isSignUp)}
          color="darkgreen"
        />
        <Button title="Forgot Password?" onPress={handleForgotPassword} color="darkgreen" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b2d0b", // dark green background
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    color: "white",
  },
  bottomButtons: {
    marginTop: 15,
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
