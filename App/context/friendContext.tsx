/**
 * filename: use_friends_strand.tsx
 * author: Dakota Strand
 * description: friends context with add/remove, favorite toggle
 */

import React, { createContext, useContext, useState, ReactNode } from "react";

// Friend object type
interface Friend {
  name: string;
  favorite: boolean;
}

interface FriendsContextType {
  friends: Friend[];
  addFriend: (name: string) => void;
  removeFriend: (name: string) => void;
  toggleFavorite: (name: string) => void;
}

export const FriendsContext = createContext<FriendsContextType | null>(null);

interface FriendsProviderProps {
  children: ReactNode;
}

export function FriendsProvider({ children }: FriendsProviderProps) {
  const [friends, setFriends] = useState<Friend[]>([
    { name: "Dakota", favorite: false },
    { name: "Jamie", favorite: false },
    { name: "Raj", favorite: false },
    { name: "Will", favorite: false },
  ]);

  const addFriend = (name: string) => setFriends((prev) => [...prev, { name, favorite: false }]);
  const removeFriend = (name: string) => setFriends((prev) => prev.filter((f) => f.name !== name));
  const toggleFavorite = (name: string) =>
    setFriends((prev) =>
      prev.map((f) => (f.name === name ? { ...f, favorite: !f.favorite } : f))
    );

  return (
    <FriendsContext.Provider value={{ friends, addFriend, removeFriend, toggleFavorite }}>
      {children}
    </FriendsContext.Provider>
  );
}
