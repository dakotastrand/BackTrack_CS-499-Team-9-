// Dakota Strand - Timer Hook
// Handles timer logic for BackTrack app

import { useState } from "react";

export function useTimer() {
  const [timer, setTimer] = useState<number | null>(null);

  const startTimer = (minutes: number) => {
    console.log("Starting timer for", minutes, "minutes");
    setTimer(minutes);
  };

  const extendTimer = (minutes: number) => {
    if (timer !== null) {
      setTimer(timer + minutes);
    }
  };

  const cancelTimer = () => setTimer(null);

  return { timer, startTimer, extendTimer, cancelTimer };
}
