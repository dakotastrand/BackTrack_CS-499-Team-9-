import { Redirect } from "expo-router";
import { useAuth } from "hooks/useAuth";

export default function Index() {
  const { isLoggedIn } = useAuth();
  const route = isLoggedIn ? "tabs/home" : "auth/login";
  console.log(`Routing user to ${route}`);
  return (
    <Redirect href={`/${route}`}/>
  );
}