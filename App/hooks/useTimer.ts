// Dakota Strand - Timer Hook
// Handles timer logic for BackTrack app

import { useState } from "react";
import useWebSocket from "./useWebSocket";

// hooks/useTimer.ts
export function useTimer() {
  const [timer, setTimer] = useState<number | null>(null);
  const socket = useWebSocket(
    process.env.EXPO_PUBLIC_API_URL,
    () => setTimer(null)
  );

  const startTimer = (
    minutes: number,
    selectedFriendUsernames: string[],
    destination: string,
    ownerUsername: string
  ) => {
    console.log("Starting timer for", minutes, "minutes");
    setTimer(minutes);
    socket?.emit("startTimer", {
      minutes,
      ownerUsername,
      selectedFriendUsernames,
      destination,
    });
  };

  const extendTimer = (minutes: number) => {
    if (timer !== null) {
      setTimer(timer + minutes);
    }
  };

  const cancelTimer = () => setTimer(null);

  return { timer, startTimer, extendTimer, cancelTimer };
}
