import { create } from "zustand";
import { Occurrence } from "../occurrences/occurrences.types";
import { mapService } from "./map.service";

interface MapState {
  markers: Occurrence[];
  heatmapData: { lat: number; lng: number; intensity: number }[];
  center: [number, number]; // [lat, lng]
  zoom: number;
  loading: boolean;
  selectedOccurrence: Occurrence | null;
  setSelectedOccurrence: (occ: Occurrence | null) => void;
  fetchMapData: () => Promise<void>;
  setViewport: (center: [number, number], zoom: number) => void;
}

// Coordenadas padrão da Cidade da Beira, Moçambique
const BEIRA_COORDS: [number, number] = [-19.8272, 34.8384];

export const useMapStore = create<MapState>((set) => ({
  markers: [],
  heatmapData: [],
  center: BEIRA_COORDS,
  zoom: 13,
  loading: false,
  selectedOccurrence: null,
  setSelectedOccurrence: (occ) => set({ selectedOccurrence: occ }),
  fetchMapData: async () => {
    set({ loading: true });
    try {
      const markers = await mapService.getMarkers();
      const heatmapData = await mapService.getHeatmapData();
      set({ markers, heatmapData, loading: false });
    } catch (error) {
      console.error("Erro ao buscar dados do mapa", error);
      set({ loading: false });
    }
  },
  setViewport: (center, zoom) => set({ center, zoom }),
}));
