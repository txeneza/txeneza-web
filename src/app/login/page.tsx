"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-forestGreen via-grey900 to-black flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative selection:bg-limeGreen selection:text-forestGreen">
      {/* Subtle Background Glows */}
      <div className="absolute top-[20%] right-[10%] w-[35%] aspect-square rounded-full bg-limeGreen/10 filter blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-[20%] left-[10%] w-[35%] aspect-square rounded-full bg-forestGreen/40 filter blur-3xl pointer-events-none -z-10" />

      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-semibold text-grey300 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Página Pública
      </Link>

      {/* Modular LoginForm Component */}
      <LoginForm />
    </div>
  );
}
