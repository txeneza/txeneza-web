import { create } from "zustand";
import { dashboardService, DashboardStats } from "./dashboard.service";

interface DashboardState {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: null,
  loading: false,
  error: null,
  fetchStats: async () => {
    set({ loading: true, error: null });
    try {
      const stats = await dashboardService.getStats();
      set({ stats, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Erro ao carregar estatísticas", loading: false });
    }
  }
}));
