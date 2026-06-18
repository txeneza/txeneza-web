"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";

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
      // Redireciona para o admin após login bem sucedido
      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Credenciais incorretas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              Painel do Administrador
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Faça login para aceder e gerir as ocorrências urbanas.
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 rounded-lg">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-4">
              <Input
                label="Email"
                type="email"
                placeholder="admin@txeneza.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Palavra-passe"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "A processar..." : "Entrar"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </PageShell>
  );
}
