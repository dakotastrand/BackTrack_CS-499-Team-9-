import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { Link, router } from "expo-router";
import { SessionProvider } from "context/sessionContext";
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
      await signIn(data.token);
    } catch (e: any) {
      Alert.alert("Login failed", e?.message ?? "Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SessionProvider>
    <KeyboardAvoidingView style={styles.container} behavior={Platform.select({ ios: "padding", android: undefined })}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome back</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          autoCapitalize="none"
          textContentType="username" // For iOS autofill
          autoComplete="username" // For Android autofill
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          textContentType="password" // For iOS autofill
          autoComplete="password" // For Android autofill
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
          <Link href="/(auth)/register" style={styles.link}>
            Create an account
          </Link>
        </Text>
      </View>
    </KeyboardAvoidingView>
    </SessionProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  card: { gap: 12, padding: 20, borderRadius: 16, borderWidth: StyleSheet.hairlineWidth },
  title: { fontSize: 22, fontWeight: "600", textAlign: "center", marginBottom: 8 },
  input: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 10, padding: 12, fontSize: 16 },
  button: { marginTop: 8, borderRadius: 10, paddingVertical: 12, alignItems: "center", borderWidth: StyleSheet.hairlineWidth },
  buttonText: { fontSize: 16, fontWeight: "600" },
  footerText: { textAlign: "center", marginTop: 12 },
  link: { textDecorationLine: "underline" },
});