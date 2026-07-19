// geocoding.service.ts
// Pesquisa de endereços/locais via Mapbox Geocoding API, com resultados
// restritos à região da Beira (bbox + proximity), para uso na barra de
// pesquisa acima do mapa de escolha de localização.

import { env } from "@/core/env";
import { BEIRA_BOUNDS } from "@/lib/geo";

export interface GeocodingResult {
  id: string;
  placeName: string;
  latitude: number;
  longitude: number;
}

const GEOCODING_ENDPOINT = "https://api.mapbox.com/geocoding/v5/mapbox.places";

// Centro aproximado da Beira, usado como "proximity" para dar prioridade a
// resultados mais próximos do centro da cidade quando há ambiguidade.
const BEIRA_CENTER: [number, number] = [34.8384, -19.8272]; // [lng, lat]

/**
 * Pesquisa locais/endereços por texto livre, limitando os resultados à
 * região da Beira através do bbox (caixa delimitadora) e da proximidade ao
 * centro da cidade. Retorna uma lista vazia em caso de erro de rede ou
 * consulta vazia — o chamador decide como lidar com isso (não lança
 * exceção, para não quebrar a experiência de pesquisa por uma falha
 * pontual de rede).
 */
export async function searchBeiraPlaces(query: string): Promise<GeocodingResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 3) return [];
  if (!env.mapboxToken) {
    console.warn("searchBeiraPlaces: NEXT_PUBLIC_MAPBOX_TOKEN não está configurado.");
    return [];
  }

  const bbox = [
    BEIRA_BOUNDS.minLng,
    BEIRA_BOUNDS.minLat,
    BEIRA_BOUNDS.maxLng,
    BEIRA_BOUNDS.maxLat,
  ].join(",");

  const params = new URLSearchParams({
    access_token: env.mapboxToken,
    bbox,
    proximity: BEIRA_CENTER.join(","),
    language: "pt",
    limit: "5",
    country: "mz",
  });

  const url = `${GEOCODING_ENDPOINT}/${encodeURIComponent(trimmed)}.json?${params.toString()}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return [];

    const data = await res.json();
    const features: any[] = Array.isArray(data?.features) ? data.features : [];

    return features.map((f) => ({
      id: f.id as string,
      placeName: f.place_name as string,
      longitude: f.center[0] as number,
      latitude: f.center[1] as number,
    }));
  } catch (err) {
    console.warn("searchBeiraPlaces: falha ao pesquisar locais.", err);
    return [];
  }
}
