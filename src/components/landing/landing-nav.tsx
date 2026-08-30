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
  { href: "#download", label: "Download App" },
];

export const LandingNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);

      // Detect active section on scroll
      const sectionIds = NAV_LINKS.map((link) => link.href.substring(1));
      const scrollPosition = window.scrollY + 140;

      let current = "";
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPosition) {
          current = sectionIds[i];
          break;
        }
      }
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const ThemeIcon = theme === "dark" ? Sun : Moon;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-forestGreen dark:bg-grey900 border-b border-white/10 shadow-md shadow-black/20 ${
        scrolled ? "py-3" : "py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-md overflow-hidden border border-white/20 bg-black/40 flex items-center justify-center shrink-0">
              <img src="/icons/TXENEZA.svg" alt="Txeneza Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              <BrandName variant="onDark" />
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) => {
              const linkId = link.href.substring(1);
              const isActive = activeSection === linkId;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-[13px] font-medium transition-colors relative py-1 ${
                    isActive
                      ? "text-limeGreen font-bold"
                      : "text-white/90 hover:text-limeGreen"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-limeGreen"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* CTA Button + Theme Toggle */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={(e) => toggleTheme({ x: e.clientX, y: e.clientY })}
              aria-label="Alternar modo claro/escuro"
              title={theme === "dark" ? "Modo claro" : "Modo escuro"}
              className="p-2 rounded-md text-white/90 hover:text-limeGreen hover:bg-white/10 transition-colors"
            >
              <ThemeIcon className="w-[18px] h-[18px]" />
            </button>
            <Link
              href="/map"
              className="flex items-center gap-2 px-4 py-2 rounded-md text-[13px] font-semibold bg-limeGreen text-forestGreen hover:bg-lightLime transition-colors shadow-md ml-1"
            >
              <Map className="w-4 h-4 stroke-[2.5]" />
              Ver Mapa
            </Link>
          </div>

          {/* Mobile: Theme Toggle */}
          <button
            onClick={(e) => toggleTheme({ x: e.clientX, y: e.clientY })}
            aria-label="Alternar modo claro/escuro"
            className="md:hidden ml-auto mr-1 p-2 rounded-md text-white/90 hover:text-limeGreen hover:bg-white/10 transition-colors"
          >
            <ThemeIcon className="w-[18px] h-[18px]" />
          </button>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-white/90 hover:text-white hover:bg-white/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
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
            className="md:hidden bg-forestGreen dark:bg-grey900 border-b border-white/10 px-6 py-6 flex flex-col gap-1 overflow-y-auto max-h-[85vh] shadow-2xl"
          >
            {NAV_LINKS.map((link) => {
              const linkId = link.href.substring(1);
              const isActive = activeSection === linkId;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-medium py-3 border-b border-white/10 transition-colors flex items-center justify-between ${
                    isActive
                      ? "text-limeGreen font-bold"
                      : "text-white/90 hover:text-limeGreen"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <div className="w-2 h-2 rounded-full bg-limeGreen" />
                  )}
                </a>
              );
            })}
            <Link
              href="/map"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full mt-4 py-3 rounded-xl text-sm font-semibold bg-limeGreen text-forestGreen hover:bg-lightLime shadow-md transition-colors"
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
