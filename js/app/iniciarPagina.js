import { iniciarLayout } from '../presentation/controllers/layoutController.js';
import { iniciarAcordeon } from '../presentation/controllers/acordeonController.js';
import { casosDeUso } from './container.js';

/** Arranque común de todas las páginas: libera solicitudes vencidas y pinta el layout. */
export async function iniciarPagina(pagina) {
  try {
    await casosDeUso.liberarSolicitudesVencidas.execute();
  } catch {
    /* no bloquea la página si el almacenamiento no está disponible */
  }
  await iniciarLayout(pagina);
  iniciarAcordeon();
}
