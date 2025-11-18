import React, { useState } from "react";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, Alert, StyleSheet, Image } from "react-native";
import { Link, router } from "expo-router";

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onRegister = async () => {
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
      if (!res.ok) throw new Error(data.error || "Registration failed");

      Alert.alert("Success", "Account created successfully! Please log in.");
      router.replace("/auth/login");
    } catch (e: any) {
      Alert.alert("Registration failed", e?.message ?? "Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      {/* Background Flowers */}
      <Image source={require("../../assets/images/flowers1.png")} style={styles.flowerBackground1} />
      <Image source={require("../../assets/images/flowers2.png")} style={styles.flowerBackground2} />

      <View style={styles.card}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Create your account</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#c0f0b3"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#c0f0b3"
        />
        <TextInput
          style={styles.input}
          placeholder="Password (min 8 chars)"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#c0f0b3"
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm password"
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
          placeholderTextColor="#c0f0b3"
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
          <Link href="/auth/login" style={styles.link}>
            Sign in
          </Link>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b2d0b",
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
    zIndex: 1,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
    color: "white",
  },
  input: {
    width: 200,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 10,
    padding: 12,
    marginVertical: 10,
    color: "white",
  },
  button: {
    marginTop: 8,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "green",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  footerText: {
    textAlign: "center",
    marginTop: 12,
    color: "white",
  },
  link: {
    textDecorationLine: "underline",
    color: "white",
  },

  flowerBackground1: {
    position: "absolute",
    top: -50,
    left: -30,
    width: 250,
    height: 250,
    opacity: 0.15,
  },
  flowerBackground2: {
    position: "absolute",
    bottom: -60,
    right: -40,
    width: 300,
    height: 300,
    opacity: 0.15,
  },
});