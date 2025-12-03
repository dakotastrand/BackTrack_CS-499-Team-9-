/*

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import Constants from "expo-constants";
import firebase from "./firebase";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

const db = getFirestore();

export async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    console.log("Push notifications only work on physical devices.");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Failed to get push token for push notifications!");
    return null;
  }

  //Get Expo push token – projectId is needed for EAS builds
  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  if (!projectId) {
    console.warn("Missing projectId for getExpoPushTokenAsync");
  }

  const tokenResponse = await Notifications.getExpoPushTokenAsync(
    projectId ? { projectId } : undefined
  );

  const token = tokenResponse.data;
  console.log("Expo push token:", token);

  // Android notification channel
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  //Save token to Firestore under the user
  const uid = auth.currentUser?.uid;
  if (uid && token) {
    await setDoc(
      doc(db, "users", uid, "pushTokens", token), // one doc per device token
      {
        token,
        platform: Platform.OS,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }

  return token;
}
*/