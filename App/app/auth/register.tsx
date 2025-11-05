import React, { useState } from "react";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, Alert, StyleSheet } from "react-native";
import { Link, router } from "expo-router";
 
export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onRegister = async () => {
    // Front-end validation
    if (!username.trim()) return Alert.alert("Please enter a username.");
    if (password.length < 8) return Alert.alert("Password must be at least 8 characters.");
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) return Alert.alert("Please enter a valid email address.");
    if (password !== confirm) return Alert.alert("Passwords do not match.");

    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      Alert.alert("Success", "Account created successfully! Please log in.");
      router.replace("/(auth)/login"); // Redirect to login screen
    } catch (e: any) {
      Alert.alert("Registration failed", e?.message ?? "Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.select({ ios: "padding", android: undefined })}>
      <View style={styles.card}>
        <Text style={styles.title}>Create your account</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password (min 8 chars)"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm password"
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
        />

        <Pressable
          disabled={submitting}
          onPress={onRegister}
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }, submitting && { opacity: 0.6 }]}
        >
          <Text style={styles.buttonText}>{submitting ? "Creating..." : "Register"}</Text>
        </Pressable>

        <Text style={styles.footerText}>
          Already have an account?{" "}
          <Link href="/(auth)/login" style={styles.link}>
            Sign in
          </Link>
        </Text>
      </View>
    </KeyboardAvoidingView>
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
