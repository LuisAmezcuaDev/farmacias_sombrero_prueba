import { escapar } from '../utils/dom.js';
import { icono } from './iconos.js';

const PLACEHOLDER = 'assets/img/medicamentos/placeholder.svg';

export function describirExistencias(unidades) {
  if (unidades <= 0) return { texto: 'Agotado por ahora', clase: 'agotado' };
  if (unidades <= 10) return { texto: `Pocas unidades: ${unidades} disponibles`, clase: 'poco' };
  return { texto: `${unidades} unidades disponibles`, clase: '' };
}

export function tarjetaMedicamento(m, nombreCategoria = '') {
  const existencias = describirExistencias(m.inventarioDisponible);
  const agotado = m.inventarioDisponible <= 0;
  return `<article class="med-card" data-id="${escapar(m.id)}">
    <div class="med-img">
      ${m.requiereReceta ? '<span class="med-etiqueta">Con receta</span>' : ''}
      <img src="${escapar(m.imagen)}" alt="Presentación de ${escapar(m.nombre)}" loading="lazy" width="300" height="300" data-fallback="${PLACEHOLDER}">
    </div>
    <div class="med-cuerpo">
      <span class="med-cat">${escapar(nombreCategoria)}</span>
      <h3 class="med-nombre">${escapar(m.nombre)}</h3>
      <p class="med-pres">${escapar(m.presentacion)}</p>
      <p class="med-desc">${escapar(m.descripcion)}</p>
      <p class="med-stock ${existencias.clase}">${existencias.texto}</p>
      <button type="button" class="btn-primario btn-bloque" data-accion="apartar" data-id="${escapar(m.id)}" ${agotado ? 'disabled' : ''}>
        ${agotado ? 'No disponible' : 'Apartar'}
      </button>
    </div>
  </article>`;
}

export function vistaCategorias(categorias) {
  return categorias
    .map(
      (c) => `<a class="categoria-tile" href="medicamentos.html?categoria=${escapar(c.id)}">
        <span class="mega-icono">${icono(c.icono, 22)}</span>
        <span><strong>${escapar(c.nombre)}</strong><small>${escapar(c.descripcion)}</small></span>
      </a>`
    )
    .join('');
}

/** Si una imagen no existe todavía, muestra el ilustrado genérico. */
export function activarFallbackImagenes(raiz) {
  raiz.addEventListener(
    'error',
    (e) => {
      const img = e.target;
      if (img instanceof HTMLImageElement && img.dataset.fallback && !img.dataset.usado) {
        img.dataset.usado = '1';
        img.src = img.dataset.fallback;
      }
    },
    true
  );
}

export function vistaMensajeError(texto) {
  return `<div class="mensaje-error" role="alert">${texto}</div>`;
}

export const MENSAJE_CARGA =
  'No se pudo cargar el catálogo. Si abriste el archivo directamente desde la carpeta, usa un servidor local (por ejemplo la extensión Live Server de VS Code) o abre el sitio publicado en GitHub Pages.';
