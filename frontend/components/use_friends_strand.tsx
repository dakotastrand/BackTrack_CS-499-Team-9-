// Dakota Strand - Friends Hook
// Manages list of friends (to later connect with backend DB)

import { useState } from "react";

export function useFriends() {
  const [friends, setFriends] = useState<string[]>([]);

  const addFriend = (name: string) => {
    if (name && !friends.includes(name)) {
      setFriends([...friends, name]);
    }
  };

  const removeFriend = (name: string) => {
    setFriends(friends.filter((friend) => friend !== name));
  };

  return { friends, addFriend, removeFriend };
}