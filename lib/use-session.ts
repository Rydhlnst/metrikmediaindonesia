"use client";

import { useState, useEffect, useCallback } from "react";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
}

interface Session {
  user: SessionUser | null;
  isLoading: boolean;
}

export function useSession(): Session & { signOut: () => Promise<void>; refresh: () => Promise<void> } {
  const [session, setSession] = useState<Session>({
    user: null,
    isLoading: true,
  });

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/get-session");
      if (res.ok) {
        const data = await res.json();
        setSession({ user: data?.user || null, isLoading: false });
      } else {
        setSession({ user: null, isLoading: false });
      }
    } catch {
      setSession({ user: null, isLoading: false });
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const signOut = async () => {
    try {
      await fetch("/api/auth/sign-out", { method: "POST" });
      setSession({ user: null, isLoading: false });
      window.location.href = "/";
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const refresh = async () => {
    await fetchSession();
  };

  return { ...session, signOut, refresh };
}
