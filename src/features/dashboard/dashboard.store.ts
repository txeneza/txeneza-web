import { create } from "zustand";
import { dashboardService, DashboardStats } from "./dashboard.service";

interface DashboardState {
  stats: DashboardStats | null;
  loading: boolean;
  isUpdating: boolean;
  lastUpdated: Date | null;
  error: string | null;
  fetchStats: (silent?: boolean) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  stats: null,
  loading: false,
  isUpdating: false,
  lastUpdated: null,
  error: null,
  fetchStats: async (silent = false) => {
    // Se não houver dados carregados, ativa o skeleton inicial
    if (!get().stats && !silent) {
      set({ loading: true, error: null });
    } else {
      // Se já houver dados, ativa o spinner de atualização no botão
      set({ isUpdating: true, error: null });
    }

    try {
      const stats = await dashboardService.getStats();
      set({
        stats,
        loading: false,
        isUpdating: false,
        lastUpdated: new Date(),
        error: null,
      });
    } catch (err: any) {
      set({
        error: err.message || "Erro ao carregar estatísticas",
        loading: false,
        isUpdating: false,
      });
    }
  },
}));
