import { icono } from './iconos.js';

/** Monta un carrusel horizontal con desplazamiento táctil, flechas y sin reproducción automática. */
export function montarCarrusel(contenedor, htmlTarjetas, etiqueta = 'Medicamentos populares') {
  const scrollPrevio = contenedor.querySelector('.carrusel-pista')?.scrollLeft ?? 0;

  contenedor.innerHTML = `
    <button type="button" class="carrusel-btn prev" aria-label="Ver anteriores">${icono('flecha-izq', 20)}</button>
    <div class="carrusel-pista" role="region" aria-label="${etiqueta}" tabindex="0">${htmlTarjetas}</div>
    <button type="button" class="carrusel-btn next" aria-label="Ver siguientes">${icono('flecha-der', 20)}</button>`;

  const pista = contenedor.querySelector('.carrusel-pista');
  const prev = contenedor.querySelector('.prev');
  const next = contenedor.querySelector('.next');

  const paso = () => {
    const tarjeta = pista.querySelector('.med-card');
    return tarjeta ? (tarjeta.getBoundingClientRect().width + 16) * 2 : 300;
  };
  const actualizar = () => {
    prev.disabled = pista.scrollLeft <= 2;
    next.disabled = pista.scrollLeft + pista.clientWidth >= pista.scrollWidth - 2;
  };

  prev.addEventListener('click', () => pista.scrollBy({ left: -paso(), behavior: 'smooth' }));
  next.addEventListener('click', () => pista.scrollBy({ left: paso(), behavior: 'smooth' }));
  pista.addEventListener('scroll', actualizar, { passive: true });
  window.addEventListener('resize', actualizar);

  pista.scrollLeft = scrollPrevio;
  actualizar();
}
