import { polygon, point } from "@turf/helpers";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";

// Limites geográficos da Cidade da Beira, Moçambique
export const BEIRA_BOUNDS = {
  minLat: -19.9000,
  maxLat: -19.7500,
  minLng: 34.8000,
  maxLng: 34.9500,
};

/**
 * Polígono aproximado da área urbana da Beira (vértices em [lat, lng]).
 *
 * NOTA IMPORTANTE: isto é uma aproximação construída a partir dos centros
 * conhecidos dos bairros (ver core/geo/beira-bairros.ts) e da forma geral da
 * península visível no mapa — NÃO é um levantamento oficial/cadastral da
 * Beira. Corta os cantos mais claramente oceânicos (a oeste de Ponta-Gêa e a
 * noroeste, junto à baía de Munhava) que uma simples caixa retangular
 * incluiria incorretamente, mas mantém-se generoso o suficiente para não
 * bloquear bairros legítimos perto da fronteira.
 *
 * Por isso mesmo, o formulário de pontos de recolha nunca bloqueia
 * definitivamente um ponto fora deste polígono — apenas avisa e pede
 * confirmação explícita do admin (ver isWithinBeira + o fluxo no
 * collection-point-form.tsx). Se/quando houver acesso a um polígono oficial
 * (ex: câmara municipal, OSM com melhor qualidade local), basta substituir
 * os vértices abaixo.
 */
const BEIRA_POLYGON_LATLNG: [number, number][] = [
  [-19.800, 34.815],
  [-19.790, 34.835],
  [-19.795, 34.860],
  [-19.815, 34.885],
  [-19.840, 34.880],
  [-19.855, 34.850],
  [-19.845, 34.828],
  [-19.815, 34.812],
  [-19.800, 34.815], // fecha o polígono (primeiro vértice repetido)
];

const BEIRA_POLYGON = polygon([BEIRA_POLYGON_LATLNG.map(([lat, lng]) => [lng, lat])]);

/**
 * Valida se um par de coordenadas está dentro do polígono da cidade da Beira.
 */
export function isWithinBeira(latitude: number, longitude: number): boolean {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return false;
  return booleanPointInPolygon(point([longitude, latitude]), BEIRA_POLYGON);
}

// Faixas de valores plausíveis para latitude/longitude na região da Beira —
// usadas apenas para detetar a troca latitude↔longitude, não para validar
// se o ponto está dentro da cidade (isso é o isWithinBeira, acima).
const PLAUSIBLE_LATITUDE_RANGE: [number, number] = [-20.0, -19.6];
const PLAUSIBLE_LONGITUDE_RANGE: [number, number] = [34.6, 35.1];

/**
 * Deteta o erro clássico de colar/inserir latitude e longitude na ordem
 * trocada: o valor no campo "latitude" parece na verdade uma longitude (e
 * vice-versa). Não decide qual é o valor "certo" — só sinaliza a suspeita,
 * para o formulário oferecer um botão de correção num clique.
 */
export function detectSwappedCoordinates(latitude: number, longitude: number): boolean {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return false;

  const latitudeLooksLikeLongitude =
    latitude >= PLAUSIBLE_LONGITUDE_RANGE[0] && latitude <= PLAUSIBLE_LONGITUDE_RANGE[1];
  const longitudeLooksLikeLatitude =
    longitude >= PLAUSIBLE_LATITUDE_RANGE[0] && longitude <= PLAUSIBLE_LATITUDE_RANGE[1];

  return latitudeLooksLikeLongitude && longitudeLooksLikeLatitude;
}
