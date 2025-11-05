import { View, Text, StyleSheet, Pressable } from "react-native";
import { useSession } from "hooks/useSession";

export default function SettingsScreen() {
  const { signOut } = useSession();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Manage your app preferences here.</Text>
      <Pressable onPress={() => signOut()} style={styles.button}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    marginBottom: 20,
  },
  button: {
    marginTop: 8,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: "center",
    backgroundColor: "#FF3B30",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});
