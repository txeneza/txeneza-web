import { Occurrence } from "../occurrences/occurrences.types";
import { occurrencesService } from "../occurrences/occurrences.service";
import { HeatPoint, generateBeiraHeatmapData } from "./beira-heatmap.data";

// Serviço para obter marcadores e dados do Heatmap do mapa público
export const mapService = {
  async getMarkers(): Promise<Occurrence[]> {
    try {
      const occurrences = await occurrencesService.getAll();
      // Apenas ocorrências pendentes ou em progresso vão para o mapa público
      return occurrences.filter(occ => occ.status === "pendente" || occ.status === "em-progresso");
    } catch (e) {
      console.error("Erro ao carregar marcadores:", e);
      return [];
    }
  },

  async getHeatmapData(): Promise<HeatPoint[]> {
    const markers = await this.getMarkers();
    
    if (markers.length > 0) {
      return markers.map(m => {
        let intensity = 0.7;
        const grav = (m.gravidade as string)?.toLowerCase();
        if (grav === "critica" || grav === "crítico") intensity = 1.0;
        else if (grav === "alta") intensity = 0.85;
        else if (grav === "media" || grav === "médio") intensity = 0.6;
        else if (grav === "baixa") intensity = 0.4;

        return {
          lat: Number(m.latitude),
          lng: Number(m.longitude),
          intensity,
        };
      });
    }

    // Se ainda não existirem denúncias reais no banco, gera malha determinística de referência da Beira
    return generateBeiraHeatmapData();
  }
};
