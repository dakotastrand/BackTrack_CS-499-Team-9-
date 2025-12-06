import { useState, useEffect, createContext, useMemo } from "react";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const SESSION_KEY = "session";
const USERNAME_KEY = "username";

interface SessionContextType {
  signIn: (token: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  session: string | null;
  username: string | null;
  isLoading: boolean;
}

export const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider(props: { children: React.ReactNode }) {
  const [session, setSession] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      try {
        let storedSession: string | null = null;
        let storedUsername: string | null = null;

        if (Platform.OS !== "web") {
          storedSession = await SecureStore.getItemAsync(SESSION_KEY);
          storedUsername = await SecureStore.getItemAsync(USERNAME_KEY);
        } else {
          storedSession = localStorage.getItem(SESSION_KEY);
          storedUsername = localStorage.getItem(USERNAME_KEY);
        }

        if (storedSession) {
          console.log("Restoring session");
          setSession(storedSession);
        }
        if (storedUsername) {
          setUsername(storedUsername);
        }
      } catch (e) {
        console.error("Failed to load session from storage", e);
      } finally {
        setIsLoading(false);
      }
    }

    loadSession();
  }, []);

  const value = useMemo(
    () => ({
      signIn: async (token: string, usernameValue: string) => {
        setSession(token);
        setUsername(usernameValue);
        try {
          if (Platform.OS !== "web") {
            await SecureStore.setItemAsync(SESSION_KEY, token);
            await SecureStore.setItemAsync(USERNAME_KEY, usernameValue);
          } else {
            localStorage.setItem(SESSION_KEY, token);
            localStorage.setItem(USERNAME_KEY, usernameValue);
          }
        } catch (e) {
          console.error("Failed to save session", e);
        }
      },
      signOut: async () => {
        setSession(null);
        setUsername(null);
        console.log("Signing out, clearing session");
        try {
          if (Platform.OS !== "web") {
            await SecureStore.deleteItemAsync(SESSION_KEY);
            await SecureStore.deleteItemAsync(USERNAME_KEY);
          } else {
            localStorage.removeItem(SESSION_KEY);
            localStorage.removeItem(USERNAME_KEY);
          }
        } catch (e) {
          console.error("Failed to clear session", e);
        }
      },
      session,
      username,
      isLoading,
    }),
    [session, username, isLoading]
  );

  return (
    <SessionContext.Provider value={value}>
      {props.children}
    </SessionContext.Provider>
  );
}
