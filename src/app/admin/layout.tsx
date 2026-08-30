"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { useAuth } from "@/hooks/use-auth";
import { useAdminRealtime } from "@/hooks/use-admin-realtime";
import { RealtimeToastAlert } from "@/components/ui/realtime-toast-alert";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const { alerts, dismissAlert } = useAdminRealtime();

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
    <>
      <RealtimeToastAlert alerts={alerts} onDismiss={dismissAlert} />
      <PageShell showSidebar={true}>
        {children}
      </PageShell>
    </>
  );
}

