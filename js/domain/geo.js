// Distancia entre dos coordenadas (fórmula de Haversine), en kilómetros.
const RADIO_TIERRA_KM = 6371;
const aRadianes = (grados) => (grados * Math.PI) / 180;

export function distanciaKm(a, b) {
  const dLat = aRadianes(b.lat - a.lat);
  const dLng = aRadianes(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(aRadianes(a.lat)) * Math.cos(aRadianes(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * RADIO_TIERRA_KM * Math.asin(Math.sqrt(h));
}
