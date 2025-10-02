import { SessionProvider, useSession } from "../context/ctx";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

function Root() {
  const { session, isLoading } = useSession();
  const segments = useSegments();
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

export default function RootLayout() {
  return (
    <SessionProvider>
      <Root />
    </SessionProvider>
  );
}