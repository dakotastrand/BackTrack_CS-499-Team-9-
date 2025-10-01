// hooks/useFriends.ts

import { useState, useCallback } from "react";

export function useFriends() {
  const [friends, setFriends] = useState<string[]>(["Alex", "Sam"]);

  const addFriend = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setFriends((prev) =>
      prev.includes(trimmed) ? prev : [...prev, trimmed]
    );

    // --- Potential backend call ---
    // await fetch(`${process.env.EXPO_PUBLIC_API_URL}/friends`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ name: trimmed }),
    // });
  }, []);

  const removeFriend = useCallback((name: string) => {
    setFriends((prev) => prev.filter((f) => f !== name));

    // --- Potential backend call ---
    // await fetch(`${process.env.EXPO_PUBLIC_API_URL}/friends/${encodeURIComponent(name)}`, {
    //   method: "DELETE",
    // });
  }, []);

  return { friends, addFriend, removeFriend };
}