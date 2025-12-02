declare module "firebase/auth/react-native" {
  import type { FirebaseApp } from "firebase/app";
  import type { Auth, Persistence } from "firebase/auth";

  // initializeAuth for RN
  export function initializeAuth(
    app: FirebaseApp,
    deps?: { persistence?: Persistence | Persistence[] }
  ): Auth;

  // AsyncStorage-backed persistence factory
  export function getReactNativePersistence(storage: {
    getItem: (key: string) => Promise<string | null>;
    setItem: (key: string, value: string) => Promise<void>;
    removeItem: (key: string) => Promise<void>;
  }): Persistence;
}
