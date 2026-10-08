import { ESTADOS_SOLICITUD } from './politicas.js';

/** Unidades de un medicamento apartadas (solicitudes activas) en una sede. */
export function unidadesApartadas(solicitudes, medicamentoId, sedeId) {
  return solicitudes
    .filter(
      (s) =>
        s.estado === ESTADOS_SOLICITUD.ACTIVA &&
        s.medicamentoId === medicamentoId &&
        s.sedeId === sedeId
    )
    .reduce((total, s) => total + s.cantidad, 0);
}

/**
 * Devuelve el medicamento con existencias reales: las unidades base menos
 * lo que está apartado. Cuando una solicitud vence, sus unidades vuelven solas.
 */
export function aplicarApartados(medicamento, solicitudes) {
  const farmacias = medicamento.farmacias.map((f) => ({
    ...f,
    disponibles: Math.max(0, f.unidades - unidadesApartadas(solicitudes, medicamento.id, f.sedeId)),
  }));
  return {
    ...medicamento,
    farmacias,
    inventarioDisponible: farmacias.reduce((total, f) => total + f.disponibles, 0),
  };
}
