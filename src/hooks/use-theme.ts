"use client";

import { useEffect, useState } from "react";

type ThemeOrigin = { x: number; y: number };

// Alguns browsers ainda não expõem startViewTransition nos tipos do DOM lib.
type DocumentWithViewTransition = Document & {
  startViewTransition?: (callback: () => void) => { ready: Promise<void> };
};

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Modo claro é o padrão; o modo escuro é opcional e memorizado por escolha do utilizador.
    const saved = localStorage.getItem("theme");
    const initialTheme = saved === "dark" ? "dark" : "light";

    setTheme(initialTheme);

    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const applyTheme = (nextTheme: "light" | "dark") => {
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);

    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // origin: ponto (x, y) do ecrã de onde a transição deve "irradiar"
  // (normalmente a posição do botão que o utilizador tocou/clicou).
  const toggleTheme = (origin?: ThemeOrigin) => {
    const nextTheme = theme === "light" ? "dark" : "light";
    const doc = document as DocumentWithViewTransition;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (origin) {
      document.documentElement.style.setProperty("--theme-x", `${origin.x}px`);
      document.documentElement.style.setProperty("--theme-y", `${origin.y}px`);
    }

    if (!prefersReducedMotion && doc.startViewTransition) {
      doc.startViewTransition(() => applyTheme(nextTheme));
    } else {
      applyTheme(nextTheme);
    }
  };

  return { theme, toggleTheme };
}
