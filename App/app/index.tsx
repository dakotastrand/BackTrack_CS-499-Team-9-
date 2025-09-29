import { Text, View } from "react-native";
import { Link } from "expo-router";


/*
export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Hi Will, I'm editing index.tsx</Text>
    </View>
  );
}
*/

export default function Home() {
  return (
    <View style={{ flex: 1, justifyContent: "center", gap: 12, padding: 24 }}>
      <Text style={{ fontSize: 20, fontWeight: "600" }}>Welcome</Text>
      <Link href="/login">Go to Login</Link>
      <Link href="/friends">Go to Friends</Link>
      <Link href="/timer">Go to Timer</Link>
    </View>
  );
}
