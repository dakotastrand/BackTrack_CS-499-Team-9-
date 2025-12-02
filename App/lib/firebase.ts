import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeAuth, getReactNativePersistence } from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDtEEI9-zqUkFs-kMbm0UhOFO2d81A60Os",
  authDomain: "backtrack-bc8fc.firebaseapp.com",
  projectId: "backtrack-bc8fc",
  storageBucket: "backtrack-bc8fc.firebasestorage.app",
  messagingSenderId: "134345247813",
  appId: "1:134345247813:web:dbb2e400d38589a668e72c",
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = (() => {
  try {
    // RN needs explicit persistence
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    // already initialized (Fast Refresh) – just grab it
    return getAuth(app);
  }
})();
