/**
 * filename: index.tsx
 * author: Dakota Strand
 * description: redirect to login screen
 */

import { Redirect } from "expo-router";
import { useAuth } from "hooks/use_auth_strand";

export default function Index() {
  const { isLoggedIn } = useAuth();

  return (
    <Redirect
      href={isLoggedIn ? "/timer_screen_strand" : "/login_screen_strand"}
    />
  );
}
