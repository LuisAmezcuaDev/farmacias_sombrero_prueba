// Utilidades puras de texto, sin dependencias de navegador.

/** Minúsculas y sin acentos, para comparar búsquedas. */
export const normalizar = (texto = '') =>
  String(texto).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

/** Fecha legible en español de México. */
export function formatearFecha(iso) {
  return new Intl.DateTimeFormat('es-MX', { dateStyle: 'full', timeStyle: 'short' }).format(new Date(iso));
}

export function formatearFechaCorta(iso) {
  return new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium' }).format(new Date(iso));
}
