/**
 * filename: use_friends_strand.tsx
 * description: friends context with add/remove, favorite toggle (SAFE JSON)
 */

import React, { createContext, useState, ReactNode, useEffect, useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import { useSession } from "../hooks/useSession";

interface Friend {
  name: string;
  favorite: boolean;
}

interface FriendsContextType {
  friends: Friend[];
  addFriend: (name: string) => void;
  removeFriend: (name: string) => Promise<void>;
  toggleFavorite: (name: string) => void;
}

export const FriendsContext = createContext<FriendsContextType | null>(null);

interface FriendsProviderProps {
  children: ReactNode;
}

// -------------------------------
// SAFE JSON PARSER
// -------------------------------
async function safeJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export function FriendsProvider({ children }: FriendsProviderProps) {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const [friends, setFriends] = useState<Friend[]>([]);
  const { session } = useSession();

  // -------------------------------
  // LOAD FRIENDS
  // -------------------------------
  useEffect(() => {
    const loadFriends = async () => {
      try {

        console.log('loading friends with token:', session);

        if (!session) {
          console.log('bruh');
          setFriends([]);
          return;
        }

        const response = await fetch(`${API_URL}/api/friends`, {
          headers: { Authorization: `Bearer ${session}` },
        });

        const data = await safeJson(response);

        if (response.ok && Array.isArray(data)) {
          setFriends(data);
          console.log("Friends loaded:", data);
        } else {
          console.error("Failed to fetch friends:", data?.message || data?.error || response.status);
          setFriends([]);
        }
      } catch (e) {
        console.error("Failed to load friends from server", e);
      }
    };

    loadFriends();
  }, [API_URL, session]);

  // -------------------------------
  // ADD FRIEND
  // -------------------------------
  const addFriend = async (name: string) => {
    const token = await SecureStore.getItemAsync("session");

    if (!token) {
      alert("You are not logged in. Please log in again.");
      return;
    }

    console.log("Current friends: ", friends);
    if (friends.some(f => f.name.toLowerCase() === name.toLowerCase())) {
      alert("A friend with this name already exists.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/friends`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: name }),
      });

      const data = await safeJson(response);

      if (response.ok) {
        setFriends(prev => [...prev, { name, favorite: false }]);
      } else {
        alert(`Error adding friend: ${data?.message || data?.error || response.statusText}`);
      }
    } catch (e) {
      console.error("Failed to add friend", e);
      alert("An error occurred while adding the friend.");
    }
  };

  // -------------------------------
  // REMOVE FRIEND
  // -------------------------------
  const removeFriend = async (name: string) => {
    const token = await SecureStore.getItemAsync("session");

    if (!token) {
      alert("You are not logged in.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/friends/${name}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await safeJson(response);

      if (response.ok) {
        setFriends(prev => prev.filter(f => f.name !== name));
      } else {
        alert(`Error removing friend: ${data?.message || data?.error || response.statusText}`);
      }
    } catch (e) {
      console.error("Failed to remove friend", e);
      alert("An error occurred while removing the friend.");
    }
  };

  // -------------------------------
  // TOGGLE FAVORITE
  // -------------------------------
  const toggleFavorite = useCallback( 
    async (name: string) => {
      const token = await SecureStore.getItemAsync("session");
      if (!token) {
        alert("You are not logged in.");
        return;
      }

      const friend = friends.find(f => f.name === name);
      if (!friend) return;

      try {
        const response = await fetch(`${API_URL}/api/friends/${name}/favorite`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ favorite: !friend.favorite }),
        });

        const data = await safeJson(response);

        if (response.ok){
          setFriends(prev =>
            prev.map(f =>
              f.name === name ? { ...f, favorite: !f.favorite } : f,
            ),
          );
        } else {
          alert(`Error updating favorite: ${data?.message || data?.error || "Unknown error"}`);
        }
      } catch (e) {
        console.error("Failed to toggle favorite", e);
        alert("An error occurred while updating the favorite status.");
      }
    },
    [friends, API_URL],
  );

  return (
    <FriendsContext.Provider value={{ friends, addFriend, removeFriend, toggleFavorite }}>
      {children}
    </FriendsContext.Provider>
  );
}
