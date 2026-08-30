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
      <div className="min-h-screen bg-background text-foreground dark:bg-grey950 flex">
        {/* Sidebar Skeleton */}
        <div className="hidden lg:flex w-64 border-r border-grey200/80 dark:border-grey800/80 p-5 flex-col gap-6 bg-white/70 dark:bg-grey900/70">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-forestGreen/20 dark:bg-limeGreen/20 animate-pulse" />
            <div className="w-28 h-5 rounded-lg bg-grey200 dark:bg-grey800 animate-pulse" />
          </div>
          <div className="flex flex-col gap-2 mt-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="w-full h-10 rounded-xl bg-grey100 dark:bg-grey800/50 animate-pulse" />
            ))}
          </div>
        </div>

        {/* Main Content Area Skeleton */}
        <div className="flex-1 flex flex-col p-6 sm:p-8">
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-grey200/60 dark:border-grey800/60">
            <div className="w-48 h-8 rounded-xl bg-grey200 dark:bg-grey800 animate-pulse" />
            <div className="flex gap-2">
              <div className="w-10 h-10 rounded-xl bg-grey200 dark:bg-grey800 animate-pulse" />
              <div className="w-10 h-10 rounded-xl bg-grey200 dark:bg-grey800 animate-pulse" />
            </div>
          </div>
          <div className="w-full h-96 rounded-2xl bg-grey100 dark:bg-grey900/60 border border-grey200/60 dark:border-grey800/60 animate-pulse" />
        </div>
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

