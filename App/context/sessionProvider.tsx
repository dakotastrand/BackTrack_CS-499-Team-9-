import React, { useState, useEffect, createContext, useContext } from "react";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const SESSION_KEY = "session";

interface SessionContextType {
  signIn: (session: string) => Promise<void>;
  signOut: () => Promise<void>;
  session: string | null;
  isLoading: boolean;
}

// Create the context with a default undefined value
const SessionContext = createContext<SessionContextType | undefined>(undefined);

/**
 * A custom hook to access the session context.
 * Throws an error if used outside of a SessionProvider.
 */
export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}

/**
 * The provider component that wraps the app and manages the session state.
 */
export function SessionProvider(props: { children: React.ReactNode }) {
  const [session, setSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      try {
        let storedSession: string | null = null;
        if (Platform.OS !== 'web') {
          // Use SecureStore on native platforms
          storedSession = await SecureStore.getItemAsync(SESSION_KEY);
        } else {
          // Use localStorage on the web
          storedSession = localStorage.getItem(SESSION_KEY);
        }

        // const storedSession = await SecureStore.getItemAsync(SESSION_KEY); // This line is redundant and causes the error
        if (storedSession) {
          setSession(storedSession);
        }
      } catch (e) {
        console.error("Failed to load session from secure storage", e);
      } finally {
        setIsLoading(false);
      }
    }

    loadSession();
  }, []);

  const value = React.useMemo(
    () => ({
      signIn: async (sessionData: string) => {
        setSession(sessionData);
        try {
          if (Platform.OS !== 'web') {
            await SecureStore.setItemAsync(SESSION_KEY, sessionData);
          } else {
            localStorage.setItem(SESSION_KEY, sessionData);
          }
        } catch (e) {
          console.error("Failed to save session", e);
        }
      },
      signOut: async () => {
        setSession(null);
        try {
          if (Platform.OS !== 'web') {
            await SecureStore.deleteItemAsync(SESSION_KEY);
          } else {
            localStorage.removeItem(SESSION_KEY);
          }
        } catch (e) {
          console.error("Failed to clear session", e);
        }
      },
      session,
      isLoading,
    }),
    [session, isLoading]
  );

  return (
    <SessionContext.Provider value={value}>
      {props.children}
    </SessionContext.Provider>
  );
}
