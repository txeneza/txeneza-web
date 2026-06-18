import { Occurrence } from "../occurrences/occurrences.types";
import { occurrencesService } from "../occurrences/occurrences.service";

// Serviço para obter marcadores e dados do Heatmap do mapa público
export const mapService = {
  async getMarkers(): Promise<Occurrence[]> {
    const occurrences = await occurrencesService.getAll();
    // Apenas ocorrências pendentes ou em progresso vão para o mapa público
    return occurrences.filter(occ => occ.status === "pendente" || occ.status === "em-progresso");
  },

  async getHeatmapData(): Promise<{ lat: number; lng: number; intensity: number }[]> {
    const markers = await this.getMarkers();
    return markers.map(m => ({
      lat: m.latitude,
      lng: m.longitude,
      intensity: 0.8,
    }));
  }
};
