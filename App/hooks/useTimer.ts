// Dakota Strand - Timer Hook
// Handles timer logic for BackTrack app

import { useEffect, useState } from "react";
import useWebSocket from "./useWebSocket";

type TimerStatus = "idle" | "running" | "expired";

export function useTimer() {
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [status, setStatus] = useState<TimerStatus>("idle");

  const socket = useWebSocket(process.env.EXPO_PUBLIC_API_URL, () => {
    setRemainingSeconds(null);
    setStatus("expired");
  });

  // Local countdown so the UI reflects the server timer
  useEffect(() => {
    if (remainingSeconds === null || remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev === null) return prev;
        const next = prev - 1;
        return next <= 0 ? 0 : next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingSeconds]);

  useEffect(() => {
    if (!socket) return;

    const handleCancelled = () => {
      setRemainingSeconds(null);
      setStatus("idle");
    };

    const handleExtended = (payload: { endTime?: string }) => {
      if (!payload?.endTime) return;
      const endMs = new Date(payload.endTime).getTime();
      const remainingMs = endMs - Date.now();
      setRemainingSeconds(Math.max(0, Math.round(remainingMs / 1000)));
      setStatus("running");
    };

    socket.on("timerCancelled", handleCancelled);
    socket.on("timerExtended", handleExtended);

    return () => {
      socket.off("timerCancelled", handleCancelled);
      socket.off("timerExtended", handleExtended);
    };
  }, [socket]);

  const startTimer = (
    minutes: number,
    selectedFriendUsernames: string[],
    destination: string,
    ownerUsername: string
  ) => {
    if (!socket) {
      console.warn("Socket not connected; cannot start timer");
      return false;
    }

    const seconds = Math.round(minutes * 60);
    setRemainingSeconds(seconds);
    setStatus("running");

    socket.emit("startTimer", {
      minutes,
      ownerUsername,
      selectedFriendUsernames,
      destination,
    });

    return true;
  };

  const extendTimer = (minutes: number, ownerUsername: string) => {
    if (!socket || remainingSeconds === null) return false;

    const addedSeconds = Math.round(minutes * 60);
    setRemainingSeconds((prev) =>
      prev === null ? null : prev + addedSeconds
    );

    socket.emit("extendTimer", {
      minutes,
      ownerUsername,
    });

    return true;
  };

  const cancelTimer = (
    ownerUsername: string,
    selectedFriendUsernames: string[],
    destination: string
  ) => {
    if (remainingSeconds === null) return;

    setRemainingSeconds(null);
    setStatus("idle");

    socket?.emit("cancelTimer", {
      ownerUsername,
      selectedFriendUsernames,
      destination,
    });
  };

  return { remainingSeconds, status, startTimer, extendTimer, cancelTimer };
}
