import { create } from "zustand";
import { Occurrence, OccurrenceFilter } from "./occurrences.types";
import { occurrencesService } from "./occurrences.service";

interface OccurrencesState {
  occurrences: Occurrence[];
  loading: boolean;
  error: string | null;
  filters: OccurrenceFilter;
  setFilters: (filters: OccurrenceFilter) => void;
  fetchOccurrences: () => Promise<void>;
  updateOccurrenceStatus: (id: string, status: Occurrence["status"]) => Promise<void>;
}

export const useOccurrencesStore = create<OccurrencesState>((set, get) => ({
  occurrences: [],
  loading: false,
  error: null,
  filters: {},
  setFilters: (filters) => {
    set({ filters });
    get().fetchOccurrences();
  },
  fetchOccurrences: async () => {
    set({ loading: true, error: null });
    try {
      const data = await occurrencesService.getAll(get().filters);
      set({ occurrences: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Erro ao buscar ocorrências", loading: false });
    }
  },
  updateOccurrenceStatus: async (id, status) => {
    try {
      await occurrencesService.updateStatus(id, status);
      await get().fetchOccurrences();
    } catch (err: any) {
      set({ error: err.message || "Erro ao atualizar estado" });
    }
  }
}));
