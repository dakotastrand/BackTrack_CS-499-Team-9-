import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { SessionProvider, useSession } from "../context/ctx";

function RootLayoutNav() {
  const { session, isLoading } = useSession();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Don't redirect until session status is known

    const inAuthGroup = segments[0] === "(auth)";

    if (session && !inAuthGroup) {
      // User is signed in but not in the main app group.
      // Redirect them to the main app.
      router.replace("/(tabs)");
    } else if (!session && inAuthGroup) {
      // User is not signed in and is in the auth group.
      // This is the correct state, so do nothing.
    } else if (!session) {
      // User is not signed in and not in the auth group.
      // Redirect them to the login screen.
      router.replace("/(auth)/login");
    }
  }, [session, isLoading, segments]);

  if (isLoading) {
    // You can return a loading indicator here
    return <View><Text>Loading...</Text></View>;
  }

  return (
    <Stack screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
<<<<<<< HEAD
  return (
    <SessionProvider>
      <RootLayoutNav />
    </SessionProvider>
=======
 return (
    <Stack screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen name="friends" options={{ title: "Friends" }} />
      <Stack.Screen name="timer" options={{ title: "Timer" }} />
    </Stack>
>>>>>>> 73d13532ad4b393cf28a807257eceea3c352349a
  );
}
