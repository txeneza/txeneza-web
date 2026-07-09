"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { useAuth } from "@/hooks/use-auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Se terminou de carregar e não há utilizador ou não é admin, redireciona para login
    if (mounted && !loading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [user, loading, router, mounted]);

  if (!mounted || loading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground dark:bg-grey900 dark:text-grey50">
        <span className="text-sm text-grey600 dark:text-grey400 animate-pulse">A validar autenticação...</span>
      </div>
    );
  }

  return (
    <PageShell showSidebar={true}>
      {children}
    </PageShell>
  );
}
