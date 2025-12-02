import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Link } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../lib/firebase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const onSend = async () => {
    const trimmed = email.trim();
    if (!trimmed) {
      Alert.alert("Missing email", "Enter the email you used to sign up.");
      return;
    }
    try {
      setSending(true);
      await sendPasswordResetEmail(auth, trimmed);
      Alert.alert("Check your inbox", "We sent you a password reset link.");
    } catch (e: any) {
      Alert.alert("Reset failed", e?.message ?? "Unable to send reset email.");
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Forgot Password</Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          placeholderTextColor="rgba(255,255,255,0.7)"
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          accessibilityLabel="Email address"
          inputMode="email"
        />

        <Pressable
          onPress={onSend}
          disabled={sending}
          style={({ pressed }) => [
            styles.button,
            pressed && { opacity: 0.85 },
            sending && { opacity: 0.6 },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Send password reset email"
        >
          <Text style={styles.buttonText}>
            {sending ? "Sending..." : "Send reset email"}
          </Text>
        </Pressable>

        <Text style={styles.footerText}>
          Remembered your password?{" "}
          <Link href="/auth/login" style={styles.link}>
            Back to Sign In
          </Link>
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
    marginBottom: 6,
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
    textDecorationLine: "underline",
    color: "white",
  },
  bottomButtons: {
    marginTop: 15,
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
