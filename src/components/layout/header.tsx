"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { useUIStore } from "@/features/ui/ui.store";
import { Sun, Moon, LogOut, Menu } from "lucide-react";
import { BrandName } from "@/components/brand/brand-name";

import { NotificationBell } from "@/components/layout/notification-bell";

export const Header: React.FC = () => {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toggleSidebar } = useUIStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const userInitial = (user?.email || "U").charAt(0).toUpperCase();

  return (
    <header className="w-full shrink-0 h-[61px] bg-white dark:bg-[#18181b] border-b border-[#e4e4e7] dark:border-[#27272a] px-4 sm:px-6 flex items-center justify-between z-[70] shadow-sm">
      <div className="flex items-center gap-3">
        {/* Botão de menu — apenas mobile */}
        {isAuthenticated && (
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 -ml-2 rounded-xl text-grey600 dark:text-grey400 hover:bg-grey100 dark:hover:bg-grey800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-forestGreen/40"
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <Link href="/" className="text-xl font-black hover:opacity-90 transition-opacity tracking-tight">
          <BrandName />
        </Link>
        <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider px-2.5 py-0.5 bg-forestGreen/10 dark:bg-limeGreen/15 text-forestGreen dark:text-limeGreen rounded-full font-bold border border-forestGreen/20 dark:border-limeGreen/25">
          <span className="w-1.5 h-1.5 rounded-full bg-forestGreen dark:bg-limeGreen shrink-0" />
          {isAuthenticated ? "Painel Admin" : "Web App"}
        </span>
      </div>

      <nav className="flex items-center gap-3">
        {/* Notificações em Tempo Real */}
        {mounted && isAuthenticated && <NotificationBell />}

        {/* Theme Switcher Button */}
        {mounted && (
          <button
            onClick={(e) => toggleTheme({ x: e.clientX, y: e.clientY })}
            className="p-2 rounded-xl bg-grey100/80 dark:bg-grey800/80 border border-grey200/80 dark:border-grey700/60 text-grey700 dark:text-grey300 hover:bg-grey200/80 dark:hover:bg-grey700/80 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-forestGreen/40"
            title={theme === "light" ? "Mudar para Modo Escuro" : "Mudar para Modo Claro"}
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Auth / Session State */}
        {mounted && (
          <>
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="hidden sm:inline w-px h-5 bg-grey200 dark:bg-grey800" />

                <div className="flex items-center gap-2.5">
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-forestGreen dark:bg-limeGreen text-white dark:text-forestGreen flex items-center justify-center text-xs font-black shrink-0 border border-black/10 dark:border-white/20 shadow-sm">
                    {userInitial}
                  </div>
                  <div className="hidden sm:flex flex-col leading-tight">
                    <span className="text-xs font-bold text-grey900 dark:text-grey50 max-w-[160px] truncate">
                      {user.email || "Utilizador"}
                    </span>
                    <span className="text-[10px] text-grey500 dark:text-grey400 font-mono uppercase tracking-wider">
                      {user.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 rounded-xl hover:bg-rose-100/80 dark:hover:bg-rose-950/60 transition-all duration-150 active:scale-[0.99]"
                  title="Terminar Sessão"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Sair</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 text-xs font-bold bg-forestGreen text-white dark:bg-limeGreen dark:text-forestGreen hover:bg-forestGreen/90 dark:hover:bg-lightLime rounded-xl shadow-sm transition-all duration-200 active:scale-[0.99]"
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
