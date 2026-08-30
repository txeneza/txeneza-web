// beira-heatmap.data.ts
// Tipos e utilitários para renderização de densidade e mapa térmico.

import { findClosestBairro } from "@/core/geo/beira-bairros";

export { findClosestBairro };

export interface HeatPoint {
  lat: number;
  lng: number;
  intensity: number; // 0..1
}

export interface BeiraHeatmapStats {
  totalPoints: number;
  bairrosCount: number;
  criticalZone: string;
}
