// Íconos SVG en línea (trazo, usan currentColor, sin colores fijos).
const RUTAS = {
  dolor: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  respiratorio: '<path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>',
  digestivo: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
  corazon: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  diabetes: '<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
  infecciones: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  piel: '<path d="M10 10.01h.01"/><path d="M10 14.01h.01"/><path d="M14 10.01h.01"/><path d="M14 14.01h.01"/><path d="M18 6v12"/><path d="M6 6v12"/><rect width="20" height="12" x="2" y="6" rx="2"/>',
  vitaminas: '<path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/>',
  buscar: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  'flecha-izq': '<path d="m15 18-6-6 6-6"/>',
  'flecha-der': '<path d="m9 18 6-6-6-6"/>',
  cerrar: '<path d="M18 6 6 18M6 6l12 12"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  ubicacion: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  carpeta: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
};

export function icono(nombre, tam = 24) {
  const ruta = RUTAS[nombre] ?? RUTAS.vitaminas;
  return `<svg class="icono" width="${tam}" height="${tam}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ruta}</svg>`;
}

/** Sombrero como símbolo cultural (ilustración genérica, no replica ningún logotipo registrado). */
export function logoSombrero(tam = 34) {
  return `<svg width="${tam}" height="${tam}" viewBox="0 0 34 34" aria-hidden="true" focusable="false"><ellipse cx="17" cy="22" rx="15" ry="4.5" fill="#F1C9DF"/><path d="M9 21 Q17 8 25 21 Z" fill="#BB2A7B"/><ellipse cx="17" cy="21" rx="6" ry="2" fill="#8F1F5E"/></svg>`;
}
