import { Redirect } from "expo-router";

// FE demo
// Later, we can use a token.
export default function Index() {
  return <Redirect href="/(auth)/login" />;
}
