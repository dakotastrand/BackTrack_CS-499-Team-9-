import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Link } from "expo-router";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Background flowers */}
      <Image source={require("../../assets/images/flowers1.png")} style={styles.flowerTopLeft} />
      <Image source={require("../../assets/images/flowers2.png")} style={styles.flowerBottomRight} />

      {/* Logo */}
      <Image source={require("../../assets/images/logo.png")} style={styles.logo} />

      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>You are logged in.</Text>

      <Link href="/tabs/friends" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Go to Friends</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/tabs/timer" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Go to Timer</Text>
        </TouchableOpacity>
      </Link>
    </View>
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
  flowerTopLeft: {
    position: "absolute",
    width: 280, // increased from 250
    height: 280, 
    top: -30,
    left: -30,
    opacity: 0.25,
    zIndex: 0,
  },
  flowerBottomRight: {
    position: "absolute",
    width: 280, // increased from 250
    height: 280,
    bottom: -30,
    right: -30,
    opacity: 0.25,
    zIndex: 0,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 15,
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    zIndex: 1,
  },
  subtitle: {
    fontSize: 18,
    color: "#c0f0b3",
    marginBottom: 20,
    zIndex: 1,
  },
  button: {
    backgroundColor: "green",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#c0f0b3",
    width: 200,
    alignItems: "center",
    marginBottom: 10,
    zIndex: 1,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    zIndex: 1,
  },
});
