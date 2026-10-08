import { casosDeUso } from '../../app/container.js';
import { ESTADOS_SOLICITUD } from '../../domain/politicas.js';
import { EVENTO_SOLICITUDES, qs, qsa } from '../utils/dom.js';
import { renderizarLayout } from '../views/layoutView.js';

export async function iniciarLayout(pagina) {
  let categorias = [];
  try {
    categorias = await casosDeUso.listarCategorias.execute();
  } catch {
    /* el menú se muestra sin categorías si el JSON no carga */
  }
  renderizarLayout({ pagina, categorias });
  activarMenu();
  await actualizarBadge();
  window.addEventListener(EVENTO_SOLICITUDES, actualizarBadge);
}

function activarMenu() {
  const botonMenu = qs('.menu-btn');
  const lista = qs('#nav-links-principal');

  botonMenu?.addEventListener('click', () => {
    const abierto = lista.classList.toggle('menu-abierto');
    botonMenu.setAttribute('aria-expanded', String(abierto));
  });

  qsa('.tiene-submenu').forEach((item) => {
    const boton = qs('.nav-boton', item);
    boton.addEventListener('click', (e) => {
      e.stopPropagation();
      const abierto = item.classList.toggle('abierto');
      boton.setAttribute('aria-expanded', String(abierto));
    });
  });

  const cerrarSubmenus = () =>
    qsa('.tiene-submenu.abierto').forEach((item) => {
      item.classList.remove('abierto');
      qs('.nav-boton', item).setAttribute('aria-expanded', 'false');
    });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.tiene-submenu')) cerrarSubmenus();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrarSubmenus();
  });
}

async function actualizarBadge() {
  const badge = qs('#badge-solicitudes');
  if (!badge) return;
  const todas = await casosDeUso.listarSolicitudes.execute();
  const activas = todas.filter((s) => s.estado === ESTADOS_SOLICITUD.ACTIVA).length;
  badge.textContent = String(activas);
  badge.hidden = activas === 0;
}
