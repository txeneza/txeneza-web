import { Occurrence } from "../occurrences/occurrences.types";
import { occurrencesService } from "../occurrences/occurrences.service";
import { HeatPoint } from "./beira-heatmap.data";

// Serviço para obter marcadores e dados do Heatmap do mapa público
export const mapService = {
  async getMarkers(): Promise<Occurrence[]> {
    const occurrences = await occurrencesService.getAll();
    // Apenas ocorrências pendentes ou em progresso vão para o mapa público
    return occurrences.filter(occ => occ.status === "pendente" || occ.status === "em-progresso");
  },

  async getHeatmapData(): Promise<HeatPoint[]> {
    // Ocorrências efetivamente reportadas representam a densidade real no mapa de calor
    const markers = await this.getMarkers();
    return markers.map(m => ({
      lat: m.latitude,
      lng: m.longitude,
      intensity: 1.0,
    }));
  }
};
