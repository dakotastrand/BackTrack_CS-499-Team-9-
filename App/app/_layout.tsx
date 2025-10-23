import { SessionProvider, useSession } from "../context/ctx";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

function Root() {
  const { session, isLoading } = useSession();
  const segments = useSegments();git add app/_layout.tsx
  const router = useRouter();

  // This effect will automatically redirect the user based on their auth state.
  useEffect(() => {
    if (isLoading) return; // Don't redirect until the session is loaded

    const inAuthGroup = segments[0] === "(auth)";

    if (session && inAuthGroup) {
      // User is signed in but is in the auth group, so redirect to the main app.
      router.replace("/(tabs)");
    } else if (!session && !inAuthGroup) {
      // User is not signed in and is not in the auth group, so redirect to the login screen.
      router.replace("/login");
    }
  }, [session, isLoading, segments]);

  return <Slot />;
}
/**
 * filename: _layout.tsx
 * author: Team 9 // Dakota Strand
 * description: Root layout providing context for auth, timer, and friends
 */

import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "hooks/use_auth_strand";
import { TimerProvider } from "hooks/use_timer_strand";
import { FriendsProvider } from "hooks/use_friends_strand";

export default function RootLayout() {
  return (
    <AuthProvider>
      <FriendsProvider>
        <TimerProvider>
          <Stack />
        </TimerProvider>
      </FriendsProvider>
    </AuthProvider>
  );
  return (
    <SessionProvider>
      <Root />
    </SessionProvider>
  );
}