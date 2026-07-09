"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Map, Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export const LandingNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const ThemeIcon = mounted && theme === "dark" ? Sun : Moon;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-grey900/90/90 backdrop-blur-md border-b border-slate-800/80 py-3 shadow-lg"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl overflow-hidden shadow-lg border border-slate-800 bg-grey900/90 group-hover:scale-105 transition-all">
              <img src="/icons/TXENEZA.svg" alt="Txeneza Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-black tracking-tight text-white group-hover:text-limeGreen transition-colors">
              Txeneza
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#problema"
              className="text-sm font-medium text-slate-300 hover:text-limeGreen transition-colors"
            >
              O Problema
            </a>
            <a
              href="#funcionamento"
              className="text-sm font-medium text-slate-300 hover:text-limeGreen transition-colors"
            >
              Como Funciona
            </a>
            <a
              href="#mapa-preview"
              className="text-sm font-medium text-slate-300 hover:text-limeGreen transition-colors"
            >
              O Mapa
            </a>
            <a
              href="#para-quem-e"
              className="text-sm font-medium text-slate-300 hover:text-limeGreen transition-colors"
            >
              Público-Alvo
            </a>
            <a
              href="#ods"
              className="text-sm font-medium text-slate-300 hover:text-limeGreen transition-colors"
            >
              Alinhamento ODS
            </a>
          </div>

          {/* CTA Button + Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Alternar modo claro/escuro"
              title={theme === "dark" ? "Modo claro" : "Modo escuro"}
              className="p-2 rounded-lg text-slate-300 hover:text-limeGreen hover:bg-white/10 transition-colors"
            >
              <ThemeIcon className="w-5 h-5" />
            </button>
            <Link
              href="/map"
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold bg-limeGreen text-forestGreen hover:bg-lightLime hover:scale-[1.02] shadow-lg shadow-limeGreen/10 active:scale-95 transition-all"
            >
              <Map className="w-4 h-4 stroke-[2.5]" />
              Ver Mapa
            </Link>
          </div>

          {/* Mobile: Theme Toggle (junto ao botão do menu) */}
          <button
            onClick={toggleTheme}
            aria-label="Alternar modo claro/escuro"
            className="md:hidden ml-auto mr-1 p-2 rounded-lg text-slate-300 hover:text-limeGreen hover:bg-white/10 transition-colors"
          >
            <ThemeIcon className="w-5 h-5" />
          </button>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-300 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Abrir Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-grey900/90 border-b border-slate-800 px-4 pt-2 pb-6 flex flex-col gap-4 shadow-xl">
          <a
            href="#problema"
            onClick={() => setIsOpen(false)}
            className="text-base font-medium text-slate-300 hover:text-limeGreen py-1.5 border-b border-slate-850"
          >
            O Problema
          </a>
          <a
            href="#funcionamento"
            onClick={() => setIsOpen(false)}
            className="text-base font-medium text-slate-300 hover:text-limeGreen py-1.5 border-b border-slate-850"
          >
            Como Funciona
          </a>
          <a
            href="#mapa-preview"
            onClick={() => setIsOpen(false)}
            className="text-base font-medium text-slate-300 hover:text-limeGreen py-1.5 border-b border-slate-850"
          >
            O Mapa
          </a>
          <a
            href="#para-quem-e"
            onClick={() => setIsOpen(false)}
            className="text-base font-medium text-slate-300 hover:text-limeGreen py-1.5 border-b border-slate-850"
          >
            Público-Alvo
          </a>
          <a
            href="#ods"
            onClick={() => setIsOpen(false)}
            className="text-base font-medium text-slate-300 hover:text-limeGreen py-1.5 border-b border-slate-850"
          >
            Alinhamento ODS
          </a>
          <Link
            href="/map"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-base font-bold bg-limeGreen text-forestGreen hover:bg-lightLime shadow-lg shadow-limeGreen/10 transition-colors"
          >
            <Map className="w-5 h-5 stroke-[2.5]" />
            Ver Mapa
          </Link>
        </div>
      )}
    </nav>
  );
};
