import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { Link, router } from "expo-router";
import { useSession } from "hooks/useSession";



export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signIn } = useSession();

  const onLogin = async () => {
    // Front-end validation
    if (!username.trim()) return Alert.alert("Please enter a username.");
    if (!password) return Alert.alert("Please enter a password.");

    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Invalid credentials");
      }

       // Use the token from the API response to sign in
      await signIn(data.token, username.trim());


      router.push("/tabs/home");

    } catch (e: any) {
      Alert.alert("Login failed", e?.message ?? "Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    // TODO: handle forgot password logic
    Alert.alert(
      "Forgot Password",
      "Password reset instructions would be sent to your email."
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.select({ ios: "padding", android: undefined })}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome to BackTrack</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          autoCapitalize="none"
          textContentType="username" // For iOS autofill
          autoComplete="username" // For Android autofill
          placeholderTextColor="#c0f0b3"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          textContentType="password" // For iOS autofill
          autoComplete="password" // For Android autofill
          placeholderTextColor="#c0f0b3"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable
          disabled={submitting}
          onPress={onLogin}
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }, submitting && { opacity: 0.6 }]}
        >
          <Text style={styles.buttonText}>{submitting ? "Logging in..." : "Login"}</Text>
        </Pressable>

        <Text style={styles.footerText}>
          New here?{" "}
          <Link href="/auth/register" style={styles.link}>
            Create an account
          </Link>
        </Text>
        <Text style={styles.footerText}>
          <Pressable onPress={handleForgotPassword}>
            <Link href="/auth/forgot" style={{ textDecorationLine: "underline", color: "white" }}>Forgot password?</Link>
          </Pressable>
        </Text>
      </View>
    </KeyboardAvoidingView>
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
  card: { 
    gap: 12, 
    padding: 20, 
    borderRadius: 16, 
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: "white", 
    backgroundColor: "#004d00",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  input: {
    width: 200,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 10,
    alignItems: "center",
    padding: 12,
    marginVertical: 10,
    marginHorizontal: 20,
    color: "white",
  },
  button: { 
    width: 150,
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 10,
    alignItems: "center", 
    padding: 12,
    marginTop: 16,
    marginBottom: 6
  },
  buttonText: { 
    fontSize: 16, 
    fontWeight: "600",
    color: "white",
  },
  footerText: { 
    textAlign: "center", 
    marginTop: 6,
    color: "white",
  },
  link: { 
    textDecorationLine: "underline" ,
    color: "white",
  },
  bottomButtons: {
    marginTop: 15,
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});