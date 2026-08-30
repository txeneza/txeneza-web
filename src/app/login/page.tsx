"use client";

import React, { useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { LoginForm } from "@/features/auth/components/login-form";
import { useAuth } from "@/hooks/use-auth";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, isAdmin } = useAuth();

  const redirectTarget = searchParams?.get("redirect");
  const destination = redirectTarget && redirectTarget.startsWith("/admin")
    ? redirectTarget
    : "/admin";

  useEffect(() => {
    // Redireciona automaticamente se já existir uma sessão ativa de administrador
    if (!loading && user && isAdmin) {
      router.replace(destination);
    }
  }, [user, loading, isAdmin, destination, router]);

  // Enquanto verifica a sessão existente no cookie/Supabase, exibe estado de transição
  if (loading || (user && isAdmin)) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-8 bg-white/80 dark:bg-grey900/80 backdrop-blur-xl border border-grey200/80 dark:border-grey800/80 rounded-3xl shadow-xl">
        <Loader2 className="w-8 h-8 text-forestGreen dark:text-limeGreen animate-spin" />
        <span className="text-xs font-bold text-grey600 dark:text-grey400 tracking-wide uppercase">
          A verificar sessão existente...
        </span>
      </div>
    );
  }

  return <LoginForm />;
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-mintGreen via-grey50 to-white dark:from-forestGreen dark:via-grey900 dark:to-black flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative selection:bg-limeGreen selection:text-forestGreen">
      {/* Subtle Background Glows */}
      <div className="absolute top-[20%] right-[10%] w-[35%] aspect-square rounded-full bg-limeGreen/10 filter blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-[20%] left-[10%] w-[35%] aspect-square rounded-full bg-forestGreen/10 dark:bg-forestGreen/40 filter blur-3xl pointer-events-none -z-10" />

      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-semibold text-forestGreen/70 dark:text-grey300 hover:text-forestGreen dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Página Pública
      </Link>

      {/* Modular LoginForm com verificação de sessão */}
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center gap-3 p-8">
            <Loader2 className="w-8 h-8 text-forestGreen dark:text-limeGreen animate-spin" />
          </div>
        }
      >
        <LoginContent />
      </Suspense>
    </div>
  );
}
