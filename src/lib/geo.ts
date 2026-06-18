// Limites geográficos da Cidade da Beira, Moçambique
export const BEIRA_BOUNDS = {
  minLat: -19.9000,
  maxLat: -19.7500,
  minLng: 34.8000,
  maxLng: 34.9500,
};

/**
 * Valida se um par de coordenadas está dentro dos limites da cidade da Beira.
 */
export function isWithinBeira(latitude: number, longitude: number): boolean {
  return (
    latitude >= BEIRA_BOUNDS.minLat &&
    latitude <= BEIRA_BOUNDS.maxLat &&
    longitude >= BEIRA_BOUNDS.minLng &&
    longitude <= BEIRA_BOUNDS.maxLng
  );
}
