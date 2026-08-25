// beira-heatmap.data.ts
// Superfície de densidade estimada de resíduos sólidos urbanos para o estudo de caso da Cidade da Beira.
// Deriva os aglomerados a partir da lista canónica de bairros em src/core/geo/beira-bairros.ts.

import { BAIRROS_BEIRA, findClosestBairro } from "@/core/geo/beira-bairros";

export { findClosestBairro };

export interface HeatPoint {
  lat: number;
  lng: number;
  intensity: number; // 0..1
}

export interface BeiraBairro {
  /** Nome do bairro / zona */
  name: string;
  /** Centro aproximado [lat, lng] */
  center: [number, number];
  /** Peso de densidade de resíduos (0..1) — quanto maior, mais crítico */
  weight: number;
  /** Dispersão geográfica dos pontos, em graus (~0.001 ≈ 110 m) */
  spread: number;
  /** Nº de pontos amostrados neste aglomerado */
  count: number;
}

// Deriva os aglomerados de estimativa térmica diretamente da lista canónica BAIRROS_BEIRA
export const BEIRA_BAIRROS: BeiraBairro[] = BAIRROS_BEIRA
  .filter((b): b is { nome: string; center: [number, number] } => !!b.center)
  .map((b) => {
    let weight = 0.5;
    let count = 6;
    const spread = 0.0060;

    if (b.nome.includes("Munhava")) { weight = 1.0; count = 14; }
    else if (b.nome.includes("Baixa")) { weight = 0.95; count = 12; }
    else if (b.nome.includes("Manga")) { weight = 0.78; count = 10; }
    else if (b.nome.includes("Goto")) { weight = 0.72; count = 8; }
    else if (b.nome.includes("Chaimite")) { weight = 0.70; count = 8; }
    else if (b.nome.includes("Esturro")) { weight = 0.64; count = 7; }
    else if (b.nome.includes("Matacuane")) { weight = 0.60; count = 6; }
    else if (b.nome.includes("Maraza")) { weight = 0.58; count = 6; }
    else if (b.nome.includes("Palmeiras")) { weight = 0.54; count = 5; }
    else if (b.nome.includes("Ponta-Gêa")) { weight = 0.48; count = 5; }
    else if (b.nome.includes("Macúti")) { weight = 0.40; count = 5; }

    return {
      name: b.nome,
      center: b.center,
      weight,
      spread,
      count,
    };
  });

// PRNG determinístico (mulberry32) — mesma sequência em servidor e cliente.
function mulberry32(seed: number): () => number {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Amostra normal (Box–Muller) a partir de um gerador uniforme.
function gaussian(rand: () => number): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = rand();
  while (v === 0) v = rand();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/**
 * Gera a superfície de densidade estimada da Beira.
 * Determinística: a mesma `seed` produz sempre o mesmo conjunto de pontos.
 */
export function generateBeiraHeatmapData(seed = 1975): HeatPoint[] {
  const rand = mulberry32(seed);
  const points: HeatPoint[] = [];

  for (const bairro of BEIRA_BAIRROS) {
    for (let i = 0; i < bairro.count; i++) {
      const dLat = gaussian(rand) * bairro.spread;
      const dLng = gaussian(rand) * bairro.spread;
      // A intensidade decai com a distância ao núcleo do bairro, com ruído controlado.
      const distFactor = Math.min(1, (Math.abs(dLat) + Math.abs(dLng)) / (bairro.spread * 2.5));
      const noise = (rand() - 0.5) * 0.2;
      const intensity = clamp(bairro.weight * (1 - distFactor * 0.55) + noise, 0.15, 1);

      points.push({
        lat: bairro.center[0] + dLat,
        lng: bairro.center[1] + dLng,
        intensity: Number(intensity.toFixed(3)),
      });
    }
  }

  return points;
}

export interface BeiraHeatmapStats {
  totalPoints: number;
  bairrosCount: number;
  criticalZone: string;
}

/** Métricas agregadas para os cartões de resumo da página. */
export function getBeiraHeatmapStats(extraPoints = 0): BeiraHeatmapStats {
  const totalPoints =
    BEIRA_BAIRROS.reduce((acc, b) => acc + b.count, 0) + extraPoints;
  const criticalZone = [...BEIRA_BAIRROS].sort((a, b) => b.weight - a.weight)[0]?.name || "Munhava Central";
  return {
    totalPoints,
    bairrosCount: BEIRA_BAIRROS.length,
    criticalZone,
  };
}
