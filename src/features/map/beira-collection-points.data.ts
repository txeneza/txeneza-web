// beira-collection-points.data.ts
// Pontos oficiais de recolha do Conselho Municipal da Beira (CMB) para demonstração.
// Usado como fallback quando a base de dados ainda não tem pontos cadastrados,
// garantindo que o mapa demonstra ambos os tipos de marcador no estudo de caso.

import { PontoRecolhaMapData } from "@/components/map/map-view";

export const BEIRA_COLLECTION_POINTS: PontoRecolhaMapData[] = [
  {
    id: "cmb-1",
    nome: "Ecoponto Mercado Central",
    latitude: -19.8352,
    longitude: 34.8402,
    bairro: "Baixa / Mercado",
    horario: "Seg–Sáb · 06h–10h",
    estado: "activo",
  },
  {
    id: "cmb-2",
    nome: "Estação de Transferência Munhava",
    latitude: -19.8112,
    longitude: 34.8452,
    bairro: "Munhava",
    horario: "Seg–Dom · 24h",
    estado: "activo",
  },
  {
    id: "cmb-3",
    nome: "Ponto de Recolha Goto",
    latitude: -19.8188,
    longitude: 34.8372,
    bairro: "Goto",
    horario: "Seg, Qua, Sex · 07h–11h",
    estado: "activo",
  },
  {
    id: "cmb-4",
    nome: "Ecoponto Esturro",
    latitude: -19.8236,
    longitude: 34.8548,
    bairro: "Esturro",
    horario: "Ter, Qui, Sáb · 07h–11h",
    estado: "inactivo",
  },
  {
    id: "cmb-5",
    nome: "Ponto de Recolha Macúti",
    latitude: -19.8281,
    longitude: 34.8705,
    bairro: "Macúti",
    horario: "Seg–Sex · 08h–12h",
    estado: "activo",
  },
  {
    id: "cmb-6",
    nome: "Ecoponto Manga",
    latitude: -19.8024,
    longitude: 34.8248,
    bairro: "Manga",
    horario: "Seg, Qua, Sex · 06h–10h",
    estado: "activo",
  },
];
