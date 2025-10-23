/**
 * filename: index.tsx
 * author: Team 9 // Dakota Strand,
 * description: redirect to login or timer screen based on login state
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
