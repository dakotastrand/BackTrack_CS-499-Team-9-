import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>You are logged in.</Text>
      <Link href="/(tabs)/friends" style={styles.link}>
        Go to Friends
      </Link>
      <Link href="/(tabs)/timer" style={styles.link}>
        Go to Timer
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", gap: 16 },
  title: { fontSize: 24, fontWeight: "bold" },
  subtitle: { fontSize: 16, color: "gray", marginBottom: 20 },
  link: { fontSize: 18, color: "#007BFF" },
});
