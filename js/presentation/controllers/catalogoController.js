import { casosDeUso } from '../../app/container.js';
import { EVENTO_SOLICITUDES, escapar, qs, qsa } from '../utils/dom.js';
import {
  MENSAJE_CARGA,
  activarFallbackImagenes,
  tarjetaMedicamento,
  vistaMensajeError,
} from '../views/medicamentoView.js';
import { vincularApartar } from './apartarController.js';

export async function iniciarCatalogo() {
  const rejilla = qs('#med-grid');
  const conteo = qs('#conteo');
  const lista = qs('#lista-categorias');
  const campoBusqueda = qs('#q-catalogo');

  const params = new URLSearchParams(window.location.search);
  const estado = { texto: params.get('q') ?? '', categoria: params.get('categoria') };
  campoBusqueda.value = estado.texto;

  activarFallbackImagenes(rejilla);
  vincularApartar(rejilla);

  let categorias;
  try {
    categorias = await casosDeUso.listarCategorias.execute();
  } catch {
    rejilla.innerHTML = vistaMensajeError(MENSAJE_CARGA);
    return;
  }
  const nombres = new Map(categorias.map((c) => [c.id, c.nombre]));

  lista.innerHTML =
    `<li><a href="medicamentos.html" data-categoria="">Todas</a></li>` +
    categorias
      .map((c) => `<li><a href="medicamentos.html?categoria=${escapar(c.id)}" data-categoria="${escapar(c.id)}">${escapar(c.nombre)}</a></li>`)
      .join('');

  async function pintar() {
    const medicamentos = await casosDeUso.listarMedicamentos.execute({
      categoria: estado.categoria || null,
      texto: estado.texto,
    });
    rejilla.innerHTML = medicamentos.length
      ? medicamentos.map((m) => tarjetaMedicamento(m, nombres.get(m.categoria))).join('')
      : `<div class="sin-resultados"><strong>No encontramos resultados</strong>Prueba con otro nombre o revisa otra categoría.</div>`;

    const etiquetaCat = estado.categoria ? ` en ${nombres.get(estado.categoria) ?? 'esta categoría'}` : '';
    conteo.textContent = `${medicamentos.length} medicamento(s)${etiquetaCat}`;

    qsa('a', lista).forEach((a) => a.classList.toggle('activo', (a.dataset.categoria || null) === (estado.categoria || null)));

    const nuevos = new URLSearchParams();
    if (estado.texto) nuevos.set('q', estado.texto);
    if (estado.categoria) nuevos.set('categoria', estado.categoria);
    const query = nuevos.toString();
    window.history.replaceState(null, '', query ? `?${query}` : window.location.pathname);
  }

  lista.addEventListener('click', (e) => {
    const enlace = e.target.closest('a[data-categoria]');
    if (!enlace) return;
    e.preventDefault();
    estado.categoria = enlace.dataset.categoria || null;
    pintar();
  });
  qs('#form-busqueda-catalogo').addEventListener('submit', (e) => e.preventDefault());
  campoBusqueda.addEventListener('input', () => {
    estado.texto = campoBusqueda.value;
    pintar();
  });

  await pintar();
  window.addEventListener(EVENTO_SOLICITUDES, pintar);
}
