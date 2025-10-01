import React, { useState, useEffect, createContext, useContext } from "react";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const SESSION_KEY = "session";

interface SessionContextType {
  signIn: () => void;
  signOut: () => void;
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
      // SecureStore is not available on the web, so we only load from it on native.
      if (Platform.OS === 'web') {
        setIsLoading(false);
        return;
      }
      try {
        const storedSession = await SecureStore.getItemAsync(SESSION_KEY);
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

  const value = {
    signIn: async () => {
      const newSession = "user-is-logged-in"; // In a real app, this would be a token from your API
      setSession(newSession);
      if (Platform.OS !== 'web') {
        await SecureStore.setItemAsync(SESSION_KEY, newSession);
      }
    },
    signOut: async () => {
      setSession(null);
      if (Platform.OS !== 'web') {
        await SecureStore.deleteItemAsync(SESSION_KEY);
      }
    },
    session,
    isLoading,
  };

  return (
    <SessionContext.Provider value={value}>
      {props.children}
    </SessionContext.Provider>
  );
}
