import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

type Theme = {
  bgTheme: "white" | "green" | "dark";
  setBgTheme: (v: "white" | "green" | "dark") => void;
  buttonColor: string;
  textColor: string;
  backgroundColor: string;
  cardBackground: string;
  placeholderColor: string;
  selectedBg: string;
  inactiveColor: string;
};

export const ThemeContext = createContext<Theme | undefined>(undefined);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [bgTheme, setBgThemeState] = useState<"white" | "green" | "dark">("white");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const stored = await SecureStore.getItemAsync("app_bg_theme");
        if (!mounted) return;
  if (stored === "green" || stored === "dark") setBgThemeState(stored as "green" | "dark");
  else setBgThemeState("white");
      } catch (e) {
        console.warn("Failed to load bg theme", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const setBgTheme = async (v: "white" | "green" | "dark") => {
    try {
      await SecureStore.setItemAsync("app_bg_theme", v);
    } catch (e) {
      console.warn("Failed to save bg theme", e);
    }
    setBgThemeState(v);
  };

  // button color is fixed per request
  const buttonColor = "#007BFF";

  const backgroundColor = bgTheme === "white" ? "#ffffff" : bgTheme === "green" ? "#0b2d0b" : "#0b0b0b";
  const cardBackground = bgTheme === "white" ? "#ffffff" : bgTheme === "green" ? "transparent" : "#121212";
  const textColor = bgTheme === "white" ? "#000" : "#fff";
  const placeholderColor = bgTheme === "white" ? "#666" : bgTheme === "green" ? "#c0f0b3" : "#bbb";
  const selectedBg = bgTheme === "white" ? "#d7dcd7ff" : bgTheme === "green" ? "#006400" : "#1f6feb";
  const inactiveColor = bgTheme === "white" ? "#666" : "#777";

  return (
    <ThemeContext.Provider
      value={{
        bgTheme,
        setBgTheme,
        buttonColor,
        textColor,
        backgroundColor,
        cardBackground,
        placeholderColor,
        selectedBg,
        inactiveColor,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}