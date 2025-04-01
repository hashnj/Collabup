"use client";

import { useEffect, useState, useCallback } from "react";

export const useTime = () => {
  const getCurrentTime = useCallback(() => {
    const now = new Date();
    return {
      time: now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }),
      date: now.toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
  }, []);

  const [currentTime, setCurrentTime] = useState({ time: "", date: "" });

  useEffect(() => {
    setCurrentTime(getCurrentTime());

    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [getCurrentTime]);

  return currentTime;
};
