import {
  ESTADOS_SOLICITUD,
  HORAS_VIGENCIA_SOLICITUD,
  TAMANO_MAX_INE_BYTES,
  TIPOS_INE_PERMITIDOS,
} from './politicas.js';

const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const limpiarTelefono = (telefono = '') => String(telefono).replace(/[\s\-().]/g, '');

export function enmascararCorreo(correo = '') {
  const [usuario = '', dominio = ''] = String(correo).trim().split('@');
  return `${usuario.charAt(0)}***@${dominio}`;
}

export function enmascararTelefono(telefono = '') {
  return `***${limpiarTelefono(telefono).slice(-4)}`;
}

export function generarFolio(fecha = new Date()) {
  const base = fecha.getTime().toString(36).toUpperCase().slice(-5);
  const azar = Math.random().toString(36).toUpperCase().slice(2, 5).padEnd(3, 'X');
  return `FS-${base}${azar}`;
}

export function calcularVencimiento(creadaEn, horas = HORAS_VIGENCIA_SOLICITUD) {
  return new Date(creadaEn.getTime() + horas * 60 * 60 * 1000);
}

/** Valida los datos de una solicitud. Devuelve { valido, errores } por campo. */
export function validarSolicitud({ cantidad, maxPermitido, solicitante = {}, sedeId, ineArchivo }) {
  const errores = {};

  if (!sedeId) errores.sede = 'Elige la farmacia donde recogerás tu medicamento.';

  if (maxPermitido < 1) {
    errores.cantidad = 'Esta farmacia ya no tiene existencias.';
  } else if (!Number.isInteger(cantidad) || cantidad < 1) {
    errores.cantidad = 'Indica una cantidad válida.';
  } else if (cantidad > maxPermitido) {
    errores.cantidad = `Máximo ${maxPermitido} unidad(es) por solicitud.`;
  }

  if (String(solicitante.nombre ?? '').trim().length < 3) errores.nombre = 'Escribe tu nombre completo.';
  if (String(solicitante.direccion ?? '').trim().length < 5) errores.direccion = 'Escribe tu dirección.';
  if (!REGEX_CORREO.test(String(solicitante.correo ?? '').trim())) errores.correo = 'Escribe un correo válido.';
  if (!/^\d{10}$/.test(limpiarTelefono(solicitante.telefono))) errores.telefono = 'Escribe un teléfono de 10 dígitos.';

  if (!ineArchivo) {
    errores.ine = 'Adjunta una foto de tu INE.';
  } else if (!TIPOS_INE_PERMITIDOS.includes(ineArchivo.tipo)) {
    errores.ine = 'La foto debe ser JPG, PNG o WEBP.';
  } else if (ineArchivo.tamano > TAMANO_MAX_INE_BYTES) {
    errores.ine = 'La foto no debe pesar más de 5 MB.';
  }

  return { valido: Object.keys(errores).length === 0, errores };
}

/**
 * Crea la solicitud lista para guardarse. No conserva la dirección ni la foto
 * del INE, y guarda correo y teléfono enmascarados (minimiza datos personales).
 */
export function crearSolicitud({ medicamento, sede, cantidad, solicitante, ahora = new Date() }) {
  return Object.freeze({
    folio: generarFolio(ahora),
    medicamentoId: medicamento.id,
    medicamentoNombre: medicamento.nombre,
    cantidad,
    sedeId: sede.id,
    sedeNombre: sede.nombre,
    solicitante: Object.freeze({
      nombre: String(solicitante.nombre).trim(),
      correoEnmascarado: enmascararCorreo(solicitante.correo),
      telefonoEnmascarado: enmascararTelefono(solicitante.telefono),
    }),
    creadaEn: ahora.toISOString(),
    venceEn: calcularVencimiento(ahora).toISOString(),
    estado: ESTADOS_SOLICITUD.ACTIVA,
  });
}

export function estaVencida(solicitud, ahora = new Date()) {
  return solicitud.estado === ESTADOS_SOLICITUD.ACTIVA && new Date(solicitud.venceEn) <= ahora;
}

export function cancelarPorVencimiento(solicitud, ahora = new Date()) {
  return {
    ...solicitud,
    estado: ESTADOS_SOLICITUD.CANCELADA,
    canceladaEn: ahora.toISOString(),
    motivoCancelacion: `No se recogió dentro de ${HORAS_VIGENCIA_SOLICITUD} horas. El medicamento se liberó.`,
  };
}
