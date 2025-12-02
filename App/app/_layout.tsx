import React from "react";
import { Stack } from "expo-router";
import { SessionProvider } from "context/sessionContext";
import ThemeProvider from "@/context/themeContext";
import { Header, HeaderShownContext } from "@react-navigation/elements";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export default function RootLayout() {
  return (
    <SessionProvider>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }} /> 
      </ThemeProvider>
    </SessionProvider>
  );
}

Notifications.setNotificationHandler({
  handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});