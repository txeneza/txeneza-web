"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { useAuth } from "@/hooks/use-auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Se terminou de carregar e não há utilizador ou não é admin, redireciona para login
    // Descomente isto para activar protecção estrita.
    /*
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
    */
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <span className="text-sm text-gray-500 animate-pulse">A validar autenticação...</span>
      </div>
    );
  }

  return (
    <PageShell showSidebar={true}>
      {children}
    </PageShell>
  );
}
