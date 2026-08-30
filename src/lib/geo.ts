import { polygon, point } from "@turf/helpers";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";

// Limites geográficos da Cidade da Beira, Moçambique (englobando todos os 31 bairros oficiais)
export const BEIRA_BOUNDS = {
  minLat: -19.9200,
  maxLat: -19.6800,
  minLng: 34.7600,
  maxLng: 34.9600,
};

/**
 * Polígono abrangente da área municipal da Cidade da Beira (vértices em [lat, lng]).
 * Cobre desde Nhangau e Inhamizua a norte até Ponta Gêa a sul, e Macuti a leste.
 */
const BEIRA_POLYGON_LATLNG: [number, number][] = [
  [-19.680, 34.880], // extremo norte (Nhangau / Nhangoma)
  [-19.720, 34.930], // nordeste
  [-19.760, 34.930],
  [-19.825, 34.920], // leste (Macuti / Estoril)
  [-19.855, 34.910],
  [-19.890, 34.880], // sul (Ponta Gêa / Porto / Foz do Púngoè)
  [-19.895, 34.835],
  [-19.870, 34.800],
  [-19.820, 34.780], // oeste
  [-19.740, 34.785], // noroeste (Muave / Chingussura)
  [-19.680, 34.880], // fecha o polígono
];

const BEIRA_POLYGON = polygon([BEIRA_POLYGON_LATLNG.map(([lat, lng]) => [lng, lat])]);

/**
 * Valida se um par de coordenadas está dentro dos limites da cidade da Beira.
 */
export function isWithinBeira(latitude: number, longitude: number): boolean {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return false;
  return booleanPointInPolygon(point([longitude, latitude]), BEIRA_POLYGON);
}

// Faixas de valores plausíveis para latitude/longitude na região da Beira —
// usadas para detetar a troca acidental latitude ↔ longitude.
const PLAUSIBLE_LATITUDE_RANGE: [number, number] = [-20.2, -19.5];
const PLAUSIBLE_LONGITUDE_RANGE: [number, number] = [34.5, 35.2];

/**
 * Deteta o erro clássico de colar/inserir latitude e longitude na ordem trocada.
 */
export function detectSwappedCoordinates(latitude: number, longitude: number): boolean {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return false;

  const latitudeLooksLikeLongitude =
    latitude >= PLAUSIBLE_LONGITUDE_RANGE[0] && latitude <= PLAUSIBLE_LONGITUDE_RANGE[1];
  const longitudeLooksLikeLatitude =
    longitude >= PLAUSIBLE_LATITUDE_RANGE[0] && longitude <= PLAUSIBLE_LATITUDE_RANGE[1];

  return latitudeLooksLikeLongitude && longitudeLooksLikeLatitude;
}
