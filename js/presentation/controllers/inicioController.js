import { casosDeUso } from '../../app/container.js';
import { EVENTO_SOLICITUDES, qs } from '../utils/dom.js';
import { montarCarrusel } from '../views/carrusel.js';
import {
  MENSAJE_CARGA,
  activarFallbackImagenes,
  tarjetaMedicamento,
  vistaCategorias,
  vistaMensajeError,
} from '../views/medicamentoView.js';
import { vincularApartar } from './apartarController.js';

export async function iniciarInicio() {
  const contCategorias = qs('#categorias-grid');
  const contCarrusel = qs('#carrusel-populares');

  qs('#form-buscador')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const texto = qs('#q').value.trim();
    window.location.href = texto ? `medicamentos.html?q=${encodeURIComponent(texto)}` : 'medicamentos.html';
  });

  activarFallbackImagenes(contCarrusel);
  vincularApartar(contCarrusel);

  try {
    const categorias = await casosDeUso.listarCategorias.execute();
    const nombres = new Map(categorias.map((c) => [c.id, c.nombre]));
    contCategorias.innerHTML = vistaCategorias(categorias);

    const pintarPopulares = async () => {
      const populares = await casosDeUso.listarMedicamentos.execute({ soloPopulares: true });
      montarCarrusel(
        contCarrusel,
        populares.map((m) => tarjetaMedicamento(m, nombres.get(m.categoria))).join('')
      );
    };
    await pintarPopulares();
    window.addEventListener(EVENTO_SOLICITUDES, pintarPopulares);
  } catch {
    contCarrusel.innerHTML = vistaMensajeError(MENSAJE_CARGA);
  }
}
