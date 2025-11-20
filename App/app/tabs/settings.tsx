import React from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { useSession } from "hooks/useSession";
import { router } from "expo-router";

export default function SettingsScreen() {
  const { signOut } = useSession();
  return (
    <View style={styles.container}>
      {/* Background flowers */}
      <Image source={require("../../assets/images/flowers1.png")} style={styles.flowerTopLeft} />
      <Image source={require("../../assets/images/flowers2.png")} style={styles.flowerBottomRight} />

      {/* Logo */}
      <Image source={require("../../assets/images/logo.png")} style={styles.logo} />

      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Manage your app preferences here.</Text>

            <Pressable

              onPress={async () => {
                await signOut();
                router.replace("/auth/login");

              }}

              style={styles.button}

            >
        <Text style={styles.buttonText}>Sign Out</Text>
      </Pressable>
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
    width: 250,  // slightly smaller
    height: 250,
    top: 0,
    left: 0,
    opacity: 0.25,
    zIndex: 0,
  },
  flowerBottomRight: {
    position: "absolute",
    width: 250,  // slightly smaller
    height: 250,
    bottom: 0,
    right: 0,
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
    textAlign: "center",
    marginBottom: 20,
    zIndex: 1,
  },
  button: {
    backgroundColor: "green",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#c0f0b3",
    alignItems: "center",
    width: 200,
    zIndex: 1,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    zIndex: 1,
  },
});