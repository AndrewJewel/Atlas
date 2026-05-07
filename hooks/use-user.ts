"use client";
import { useState, useEffect } from "react";
import { getUser, saveUser } from "@/lib/user-store";
import type { User } from "@/lib/types";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setUser(getUser());
    setLoaded(true);
  }, []);

  const completeOnboarding = (u: User) => {
    saveUser(u);
    setUser(u);
  };

  return { user, loaded, completeOnboarding };
}
