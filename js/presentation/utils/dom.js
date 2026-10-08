export const qs = (selector, raiz = document) => raiz.querySelector(selector);
export const qsa = (selector, raiz = document) => [...raiz.querySelectorAll(selector)];

/** Escapa texto antes de insertarlo como HTML (evita inyección con datos del usuario). */
export function escapar(valor) {
  return String(valor ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

export const EVENTO_SOLICITUDES = 'solicitudes:cambio';
export const notificarCambioSolicitudes = () => window.dispatchEvent(new CustomEvent(EVENTO_SOLICITUDES));
