/**
 * filename: use_timer_strand.tsx
 * author: Dakota Strand
 * description: timer context and hook for BackTrack app
 */

import React, { createContext, useContext, useState, useRef, ReactNode } from "react";

// Define what the timer context provides
interface TimerContextType {
  time: number; // current timer in seconds
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
}

// Create the context
const TimerContext = createContext<TimerContextType | null>(null);

// Props for the provider
interface TimerProviderProps {
  children: ReactNode;
}

// Provide timer context to all children
export function TimerProvider({ children }: TimerProviderProps) {
  const [time, setTime] = useState(0);

  // Fixed type for intervalRef to satisfy TypeScript
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
// Dakota Strand - Timer Hook
// Handles timer logic for BackTrack app

import { useState } from "react";
import useWebSocket from "./useWebSocket";

export function useTimer() {
  const [timer, setTimer] = useState<number | null>(null);
  const socket = useWebSocket(
    process.env.EXPO_PUBLIC_API_URL
  )

  const startTimer = (minutes: number) => {
    console.log("Starting timer for", minutes, "minutes");
    setTimer(minutes);
    socket?.emit("data", "hello world")
  };

  const startTimer = () => {
    if (intervalRef.current) return; // already running
    intervalRef.current = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resetTimer = () => {
    stopTimer();
    setTime(0);
  };

  return (
    <TimerContext.Provider value={{ time, startTimer, stopTimer, resetTimer }}>
      {children}
    </TimerContext.Provider>
  );
}

// Hook to consume the timer context
export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) throw new Error("useTimer must be used within TimerProvider");
  return context;
};
