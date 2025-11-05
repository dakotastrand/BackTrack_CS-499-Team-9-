import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "context/authContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack />
    </AuthProvider>
  );
}