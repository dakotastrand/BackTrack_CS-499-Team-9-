/**
 * filename: use_auth_strand.tsx
 * author: Dakota Strand
 * description: authentication context and hook with signup & forgot password
 */

import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  user: string | null;
  login: (username: string) => void;
  logout: () => void;
  signUp: (username: string) => boolean;
  forgotPassword: (username: string) => void;
}

interface AuthProviderProps { children: ReactNode; }

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [users, setUsers] = useState<string[]>([]);

  const login = (username: string) => { if (users.includes(username)) { setUser(username); setIsLoggedIn(true); } };
  const logout = () => { setUser(null); setIsLoggedIn(false); };
  const signUp = (username: string) => {
    if (users.includes(username)) return false;
    setUsers([...users, username]);
    return true;
  };
  const forgotPassword = (username: string) => { console.log(`Password reset for ${username}`); };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, signUp, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
