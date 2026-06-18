import { useEffect, useState } from "react";
import { UserSession, subscribeToAuthChanges, loginWithEmail, logout } from "@/core/auth";

export function useAuth() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

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
