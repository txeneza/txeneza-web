"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Mail, Lock, ArrowLeft, AlertCircle, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Credenciais de acesso incorretas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative selection:bg-limeGreen selection:text-forestGreen">
      {/* Subtle Background Glows */}
      <div className="absolute top-[20%] right-[10%] w-[35%] aspect-square rounded-full bg-forestGreen/10 filter blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] left-[10%] w-[35%] aspect-square rounded-full bg-forestGreen/10 filter blur-3xl pointer-events-none -z-10" />

      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Página Pública
      </Link>

      {/* Login Card */}
      <div className="w-full max-w-[420px] bg-slate-900 border border-slate-850 rounded-3xl p-8 sm:p-10 shadow-2xl relative">
        
        {/* Institutional Branding */}
        <div className="text-center flex flex-col items-center gap-3.5 mb-8">
          <div className="w-16 h-20 overflow-hidden shrink-0 filter drop-shadow-[0_5px_10px_rgba(181,242,48,0.1)]">
            <img src="/image/TXENEZA.png" alt="Txeneza Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              Painel de Gestão
            </h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1.5 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-limeGreen" />
              Vereação de Higiene e Salubridade
            </p>
            <p className="text-[10px] text-slate-550 font-medium uppercase mt-0.5">
              Conselho Municipal da Beira
            </p>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/25 flex gap-3 items-start text-xs text-red-400">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Falha na Autenticação</span>
              <p className="mt-0.5 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Endereço de E-mail
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-550">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                placeholder="nome@txeneza.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-limeGreen/50 focus:ring-2 focus:ring-limeGreen/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Palavra-passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-550">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-650 focus:outline-none focus:border-limeGreen/50 focus:ring-2 focus:ring-limeGreen/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl text-sm font-bold bg-forestGreen text-white hover:bg-forestGreen/85 focus:outline-none focus:ring-2 focus:ring-forestGreen/50 border border-forestGreen/30 shadow-lg active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "A processar..." : "Entrar no Sistema"}
          </button>
        </form>

        {/* Footer tip */}
        <div className="mt-8 text-center text-[10px] text-slate-600">
          Apenas acessível a funcionários autorizados da CMB. Todas as tentativas de acesso são registadas para auditoria de segurança.
        </div>

      </div>
    </div>
  );
}
