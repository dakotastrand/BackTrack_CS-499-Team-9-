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
}
