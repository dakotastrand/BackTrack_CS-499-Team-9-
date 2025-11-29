import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, Image, FlatList } from "react-native";
import { useSession } from "hooks/useSession";
import { router } from "expo-router";


interface Alert {
  message: string;
  duration: number;
  status: string;
  notified_friends: string[];
  start_time: string;
}

export default function SettingsScreen() {
  const { signOut, session } = useSession();
  const [settings, setSettings] = useState<Alert[]>([]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/settings`, {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        } else {
          console.error("Failed to fetch settings");
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    if (session) {
      fetchSettings();
    }
  }, [session]);

  const renderAlert = ({ item }: { item: Alert }) => (
    <View style={styles.alertContainer}>
      <Text style={styles.alertText}>Destination: {item.message}</Text>
      <Text style={styles.alertText}>Duration: {item.duration} minutes</Text>
      <Text style={styles.alertText}>Status: {item.status}</Text>
      <Text style={styles.alertText}>Notified Friends: {item.notified_friends.join(", ")}</Text>
      <Text style={styles.alertText}>Time: {new Date(item.start_time).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Background flowers */}
      <Image source={require("../../assets/images/flowers1.png")} style={styles.flowerTopLeft} />
      <Image source={require("../../assets/images/flowers2.png")} style={styles.flowerBottomRight} />

      {/* Logo */}
      <Image source={require("../../assets/images/logo.png")} style={styles.logo} />

      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Manage your app preferences here.</Text>

      <FlatList
        data={settings}
        renderItem={renderAlert}
        keyExtractor={(item, index) => index.toString()}
        style={styles.list}
      />

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
  list: {
    width: '100%',
    marginTop: 20,
  },
  alertContainer: {
    backgroundColor: 'rgba(0, 100, 0, 0.3)',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'green',
  },
  alertText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
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
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    zIndex: 1,
  },
});