import { Occurrence } from "../occurrences/occurrences.types";
import { occurrencesService } from "../occurrences/occurrences.service";
import { generateBeiraHeatmapData, HeatPoint } from "./beira-heatmap.data";

// Serviço para obter marcadores e dados do Heatmap do mapa público
export const mapService = {
  async getMarkers(): Promise<Occurrence[]> {
    const occurrences = await occurrencesService.getAll();
    // Apenas ocorrências pendentes ou em progresso vão para o mapa público
    return occurrences.filter(occ => occ.status === "pendente" || occ.status === "em-progresso");
  },

  async getHeatmapData(): Promise<HeatPoint[]> {
    // Superfície de densidade estimada para o estudo de caso da Beira.
    const modelled = generateBeiraHeatmapData();

    // Ocorrências efetivamente reportadas reforçam a densidade nos seus locais.
    const markers = await this.getMarkers();
    const reported: HeatPoint[] = markers.map(m => ({
      lat: m.latitude,
      lng: m.longitude,
      intensity: 1,
    }));

    return [...modelled, ...reported];
  }
};
