// Dakota Strand - Authentication Hook
// Handles login logic (to be connected with backend later)

import { useState } from "react";

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const login = (email: string, password: string) => {
    console.log("Logging in with", email, password);
    // TODO: Replace with real backend call
    setIsLoggedIn(true);
  };

  const logout = () => setIsLoggedIn(false);

  return { isLoggedIn, login, logout };
}
