"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Map, Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { motion, AnimatePresence } from "framer-motion";
import { BrandName } from "@/components/brand/brand-name";

const NAV_LINKS = [
  { href: "#problema", label: "O Problema" },
  { href: "#funcionamento", label: "Como Funciona" },
  { href: "#mapa-preview", label: "O Mapa" },
  { href: "#para-quem-e", label: "Público-Alvo" },
  { href: "#ods", label: "Alinhamento ODS" },
];

export const LandingNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const ThemeIcon = mounted && theme === "dark" ? Sun : Moon;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 border-b ${
        scrolled
          ? "bg-forestGreen dark:bg-grey900 border-white/10 py-3"
          : "bg-forestGreen/0 border-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md overflow-hidden border border-white/15 bg-grey900">
              <img src="/icons/TXENEZA.svg" alt="Txeneza Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              <BrandName variant="onDark" />
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[13px] font-medium text-slate-300 hover:text-limeGreen transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA Button + Theme Toggle */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Alternar modo claro/escuro"
              title={theme === "dark" ? "Modo claro" : "Modo escuro"}
              className="p-2 rounded-md text-slate-300 hover:text-limeGreen hover:bg-white/5 transition-colors"
            >
              <ThemeIcon className="w-[18px] h-[18px]" />
            </button>
            <Link
              href="/map"
              className="flex items-center gap-2 px-4 py-2 rounded-md text-[13px] font-semibold bg-limeGreen text-forestGreen hover:bg-lightLime transition-colors ml-1"
            >
              <Map className="w-4 h-4 stroke-[2.5]" />
              Ver Mapa
            </Link>
          </div>

          {/* Mobile: Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Alternar modo claro/escuro"
            className="md:hidden ml-auto mr-1 p-2 rounded-md text-slate-300 hover:text-limeGreen hover:bg-white/5 transition-colors"
          >
            <ThemeIcon className="w-[18px] h-[18px]" />
          </button>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-300 hover:text-white p-2 rounded-md hover:bg-white/5 transition-colors"
              aria-label="Abrir Menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden bg-forestGreen dark:bg-grey900 border-b border-white/10 px-6 py-6 flex flex-col gap-1 overflow-hidden"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-slate-200 hover:text-limeGreen py-3 border-b border-white/10 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/map"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full mt-4 py-3 rounded-md text-sm font-semibold bg-limeGreen text-forestGreen hover:bg-lightLime transition-colors"
            >
              <Map className="w-4 h-4 stroke-[2.5]" />
              Ver Mapa
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
