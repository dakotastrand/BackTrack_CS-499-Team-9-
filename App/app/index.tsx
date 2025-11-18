import { Stack, useSegments, useRouter, Redirect } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useSession } from "hooks/useSession";

export default function Root() {
  const { session, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (session) {
      router.replace("/tabs/home");
    } else {
      router.replace("/auth/login");
    }
  }, [session, isLoading]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="tabs" />
    </Stack>
  );
}