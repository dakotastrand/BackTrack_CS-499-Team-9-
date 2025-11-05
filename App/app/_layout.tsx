import React from "react";
import { Stack } from "expo-router";
import { SessionProvider } from "context/sessionContext";
import ThemeProvider from "@/context/themeContext";

export default function RootLayout() {
  return (
    <SessionProvider>
      <ThemeProvider>
        <Stack />
      </ThemeProvider>
    </SessionProvider>
  );
}