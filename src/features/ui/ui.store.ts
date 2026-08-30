import { create } from "zustand";

interface UIState {
  /** Estado do drawer da barra lateral em ecrãs pequenos (mobile). */
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;

  /** Estado de recolhimento da barra lateral no desktop (compacta vs expandida). */
  sidebarCollapsed: boolean;
  toggleSidebarCollapsed: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  openSidebar: () => set({ sidebarOpen: true }),
  closeSidebar: () => set({ sidebarOpen: false }),

  sidebarCollapsed:
    typeof window !== "undefined"
      ? localStorage.getItem("txeneza_sidebar_collapsed") === "true"
      : false,

  toggleSidebarCollapsed: () =>
    set((s) => {
      const next = !s.sidebarCollapsed;
      if (typeof window !== "undefined") {
        localStorage.setItem("txeneza_sidebar_collapsed", next ? "true" : "false");
      }
      return { sidebarCollapsed: next };
    }),

  setSidebarCollapsed: (collapsed: boolean) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("txeneza_sidebar_collapsed", collapsed ? "true" : "false");
    }
    set({ sidebarCollapsed: collapsed });
  },
}));
