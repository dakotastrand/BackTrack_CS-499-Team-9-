import React from "react";
import { Stack } from "expo-router";
import { SessionProvider } from "context/sessionContext";
import ThemeProvider from "@/context/themeContext";
import { Header, HeaderShownContext } from "@react-navigation/elements";

export default function RootLayout() {
  return (
    <SessionProvider>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }} /> 
      </ThemeProvider>
    </SessionProvider>
  );
}