/**
 * filename: use_timer_strand.tsx
 * author: Dakota Strand
 * description: timer context and hook
 */

import React, { createContext, useContext, useState, useRef, ReactNode } from "react";

// define what the timer context will provide
interface TimerContextType {
  time: number;
  start: () => void;
  stop: () => void;
}

// create the context
const TimerContext = createContext<TimerContextType | null>(null);

// props for the provider
interface TimerProviderProps {
  children: ReactNode;
}

// provide timer context to all children
export function TimerProvider({ children }: TimerProviderProps) {
  const [time, setTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timer | null>(null);

  const start = () => {
    if (intervalRef.current) return; // prevent multiple intervals
    intervalRef.current = setInterval(() => setTime((t) => t + 1), 1000);
  };

  const stop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  return (
    <TimerContext.Provider value={{ time, start, stop }}>
      {children}
    </TimerContext.Provider>
  );
}

// hook to consume the timer context
export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) throw new Error("useTimer must be used within TimerProvider");
  return context;
};
