import { useEffect, useState } from "react";
import { UserSession, subscribeToAuthChanges, loginWithEmail, logout } from "@/core/auth";
import { cookiesManager } from "@/lib/cookies";

export function useAuth() {
  const [user, setUser] = useState<UserSession | null>(() => {
    if (typeof window !== "undefined") {
      const saved = cookiesManager.get("txeneza_session");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return null;
        }
      }
    }
    return null;
  });
  
  const [loading, setLoading] = useState(() => {
    if (typeof window !== "undefined") {
      return !cookiesManager.get("txeneza_session");
    }
    return true;
  });

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
    login: loginWithEmail,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };
}
