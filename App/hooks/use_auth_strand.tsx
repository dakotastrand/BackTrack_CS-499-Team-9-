/**
 * filename: use_auth_strand.tsx
 * author: Dakota Strand
 * description: authentication context and hook
 */

import React, { createContext, useContext, useState, ReactNode } from "react";

// define what the auth context will provide
interface AuthContextType {
  isLoggedIn: boolean;
  user: string | null;
  login: (username: string) => void;
  logout: () => void;
}

// create the context
const AuthContext = createContext<AuthContextType | null>(null);

// props for the provider
interface AuthProviderProps {
  children: ReactNode;
}

// provide auth context to all children
export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  const login = (username: string) => {
    setUser(username);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// hook to consume the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
