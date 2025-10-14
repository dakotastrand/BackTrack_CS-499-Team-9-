/**
 * filename: _layout.tsx
 * author: Dakota Strand
 * description: root layout providing context for auth, timer, and friends
 */

import { Stack } from "expo-router";
import { AuthProvider } from "hooks/use_auth_strand";
import { TimerProvider } from "hooks/use_timer_strand";
import { FriendsProvider } from "hooks/use_friends_strand";

// wrap stack in providers so all screens have access to context
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
}