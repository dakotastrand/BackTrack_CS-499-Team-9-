/**
 * filename: use_friends_strand.tsx
 * author: Dakota Strand
 * description: friends context and hook
 */

import React, { createContext, useContext, useState, ReactNode } from "react";

// define what the friends context will provide
interface FriendsContextType {
  friends: string[];
  addFriend: (name: string) => void;
}

// create the context
const FriendsContext = createContext<FriendsContextType | null>(null);

// props for the provider
interface FriendsProviderProps {
  children: ReactNode;
}

// provide friends context to all children
export function FriendsProvider({ children }: FriendsProviderProps) {
  const [friends, setFriends] = useState(["alex", "jordan"]);

  const addFriend = (name: string) => setFriends((prev) => [...prev, name]);

  return (
    <FriendsContext.Provider value={{ friends, addFriend }}>
      {children}
    </FriendsContext.Provider>
  );
}

// hook to consume the friends context
export const useFriends = () => {
  const context = useContext(FriendsContext);
  if (!context) throw new Error("useFriends must be used within FriendsProvider");
  return context;
};