import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import Constants from "expo-constants";
import { auth } from "./firebase";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

const db = getFirestore();

export async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) return null; // Emulators won't get real tokens

  
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") return null;

  // 2) Get Expo push token (needs your EAS projectId in app.json/app.config)
  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId; // works for dev/prod
  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;

  // 3) Save to Firestore under the user
  const uid = auth.currentUser?.uid;
  if (uid) {
    await setDoc(
      doc(db, "users", uid, "pushTokens", token), // one doc per token (good for multiple devices)
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
