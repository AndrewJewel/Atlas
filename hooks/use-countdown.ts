"use client";
import { useState, useEffect } from "react";

export function useCountdown(target: Date) {
  const [diff, setDiff] = useState(target.getTime() - Date.now());

  useEffect(() => {
    const t = setInterval(() => setDiff(target.getTime() - Date.now()), 1000);
    return () => clearInterval(t);
  }, [target]);

  const total = Math.max(0, Math.floor(diff / 1000));
  return {
    days:  Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    mins:  Math.floor((total % 3600) / 60),
    secs:  total % 60,
    done:  total <= 0,
  };
}
