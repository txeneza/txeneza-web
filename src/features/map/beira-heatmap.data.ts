// beira-heatmap.data.ts
// Superfície de densidade estimada de resíduos sólidos urbanos para o estudo de caso da Cidade da Beira.
// Os pontos são gerados de forma DETERMINÍSTICA (PRNG semeado) a partir de aglomerados
// ancorados em bairros reais da Beira, para garantir estabilidade entre SSR/CSR e métricas consistentes.

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

// Aglomerados ancorados na geografia real da Beira (cidade costeira, centro ~ -19.83 / 34.84).
// Munhava (zona industrial/informal a NO) e a Baixa/Mercado Central concentram maior geração
// de resíduos; a orla do Macúti, mais turística, apresenta densidade inferior.
export const BEIRA_BAIRROS: BeiraBairro[] = [
  { name: "Munhava",        center: [-19.8090, 34.8470], weight: 1.0,  spread: 0.0075, count: 14 },
  { name: "Baixa / Mercado",center: [-19.8340, 34.8390], weight: 0.95, spread: 0.0050, count: 12 },
  { name: "Manga",          center: [-19.8010, 34.8230], weight: 0.78, spread: 0.0090, count: 10 },
  { name: "Goto",           center: [-19.8170, 34.8360], weight: 0.72, spread: 0.0060, count: 8  },
  { name: "Chaimite",       center: [-19.8380, 34.8460], weight: 0.70, spread: 0.0055, count: 8  },
  { name: "Esturro",        center: [-19.8250, 34.8560], weight: 0.64, spread: 0.0060, count: 7  },
  { name: "Matacuane",      center: [-19.8300, 34.8520], weight: 0.60, spread: 0.0050, count: 6  },
  { name: "Maraza",         center: [-19.7960, 34.8320], weight: 0.58, spread: 0.0070, count: 6  },
  { name: "Palmeiras",      center: [-19.8150, 34.8290], weight: 0.54, spread: 0.0055, count: 5  },
  { name: "Ponta-Gêa",      center: [-19.8430, 34.8380], weight: 0.48, spread: 0.0045, count: 5  },
  { name: "Macúti",         center: [-19.8270, 34.8720], weight: 0.40, spread: 0.0060, count: 5  },
];

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
  const criticalZone = [...BEIRA_BAIRROS].sort((a, b) => b.weight - a.weight)[0].name;
  return {
    totalPoints,
    bairrosCount: BEIRA_BAIRROS.length,
    criticalZone,
  };
}
