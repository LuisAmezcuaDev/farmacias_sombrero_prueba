// Reglas de negocio del apartado de medicamentos. Cambiar aquí cambia todo el sistema.

export const MAX_UNIDADES_POR_SOLICITUD = 3;
export const HORAS_VIGENCIA_SOLICITUD = 72;
export const TAMANO_MAX_INE_BYTES = 5 * 1024 * 1024;
export const TIPOS_INE_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];

export const ESTADOS_SOLICITUD = Object.freeze({
  ACTIVA: 'activa',
  CANCELADA: 'cancelada',
});
