// Dakota Strand - Timer Hook
// Handles timer logic for BackTrack app

import { useState } from "react";
import useWebSocket from "./useWebSocket";

export function useTimer() {
  const [timer, setTimer] = useState<number | null>(null);
  // functions that get data from the websocket need to be declared before the websocket declaration
  const completeTimer = () => {
    setTimer(null);
  }

  const socket = useWebSocket(
    process.env.EXPO_PUBLIC_API_URL, completeTimer
  )

  // functions that send data via the websocket need to be declared after the websocket declaration
  const startTimer = (minutes: number) => {
    console.log("Starting timer for", minutes, "minutes");
    setTimer(minutes);
    socket?.emit("startTimer", minutes)
  };

  const extendTimer = (minutes: number) => {
    if (timer !== null) {
      setTimer(timer + minutes);
    }
  };

  const cancelTimer = () => setTimer(null);

  return { timer, startTimer, extendTimer, cancelTimer };
}