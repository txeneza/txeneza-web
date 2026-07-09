"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { Sun, Moon, LogOut, User } from "lucide-react";

export const Header: React.FC = () => {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="w-full bg-light-background dark:bg-dark-background/80 dark:bg-grey900/80 backdrop-blur-md border-b border-grey200 dark:border-grey800 dark:border-grey800 py-4 px-6 flex items-center justify-between sticky top-0 z-50 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <Link href="/" className="text-xl font-black text-forestGreen dark:text-limeGreen hover:opacity-90 transition-opacity">
          Txeneza
        </Link>
        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-forestGreen/10 dark:bg-limeGreen/10 text-forestGreen dark:text-limeGreen rounded-full font-bold">
          Web App
        </span>
      </div>

      <nav className="flex items-center gap-6">
        <Link href="/map" className="text-sm font-semibold text-grey600 dark:text-grey300 dark:text-grey200 dark:text-grey700 hover:text-forestGreen dark:hover:text-limeGreen transition-colors">
          Mapa
        </Link>
        <Link href="/admin" className="text-sm font-semibold text-grey600 dark:text-grey300 dark:text-grey200 dark:text-grey700 hover:text-forestGreen dark:hover:text-limeGreen transition-colors">
          Admin
        </Link>

        {/* Separador */}
        <span className="w-px h-4 bg-grey350 dark:bg-grey800 dark:bg-gray-850" />

        {/* Theme Switcher Button */}
        {mounted && (
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-grey100 dark:bg-grey900/40 dark:bg-grey950 border border-grey200 dark:border-grey800 dark:border-grey850 text-grey600 dark:text-grey400 dark:text-grey300 dark:text-grey500 hover:text-forestGreen dark:hover:text-limeGreen hover:scale-105 transition-all duration-200"
            title={theme === "light" ? "Mudar para Modo Escuro" : "Mudar para Modo Claro"}
          >
            {theme === "light" ? (
              <Moon className="w-4.5 h-4.5" />
            ) : (
              <Sun className="w-4.5 h-4.5" />
            )}
          </button>
        )}

        {/* Auth / Session State */}
        {mounted && (
          <>
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end text-xs">
                  <span className="font-bold text-grey900 dark:text-grey50 dark:text-gray-100">{user.email || "Utilizador"}</span>
                  <span className="text-[10px] text-grey300 dark:text-grey500 dark:text-grey600 dark:text-grey400 font-mono capitalize">{user.role}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/30 rounded-xl hover:bg-red-100 dark:hover:bg-red-950/40 transition-colors"
                  title="Terminar Sessão"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Sair</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 text-xs font-bold bg-limeGreen text-forestGreen hover:bg-lightLime rounded-xl shadow-sm hover:shadow transition-all duration-200"
              >
                Entrar
              </Link>
            )}
          </>
        )}
      </nav>
    </header>
  );
};
