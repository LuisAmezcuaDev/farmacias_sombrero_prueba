import { casosDeUso } from '../../app/container.js';
import { ESTADOS_SOLICITUD, HORAS_VIGENCIA_SOLICITUD } from '../../domain/politicas.js';
import { formatearFecha } from '../../shared/texto.js';
import { EVENTO_SOLICITUDES, escapar, notificarCambioSolicitudes, qs } from '../utils/dom.js';

function tarjetaSolicitud(s) {
  const activa = s.estado === ESTADOS_SOLICITUD.ACTIVA;
  const horas = Math.max(0, Math.ceil((new Date(s.venceEn) - Date.now()) / 3600000));
  const detalle = activa
    ? `<p>Recógela antes del <strong>${escapar(formatearFecha(s.venceEn))}</strong> (te quedan ${horas} h aprox.).</p>`
    : `<p>${escapar(s.motivoCancelacion ?? 'Solicitud cancelada.')}</p>`;
  return `<article class="solicitud">
    <div class="solicitud-cab">
      <h3>${escapar(s.medicamentoNombre)} x ${s.cantidad}</h3>
      <span class="estado ${s.estado}">${activa ? 'Activa' : 'Cancelada'}</span>
    </div>
    <p>Folio <strong>${escapar(s.folio)}</strong> · ${escapar(s.sedeNombre)} · a nombre de ${escapar(s.solicitante.nombre)}</p>
    ${detalle}
  </article>`;
}

export async function iniciarSolicitudes() {
  const raiz = qs('#solicitudes-lista');

  async function pintar() {
    const solicitudes = await casosDeUso.listarSolicitudes.execute();
    raiz.innerHTML = solicitudes.length
      ? solicitudes.map(tarjetaSolicitud).join('')
      : `<div class="vacio"><strong>Aún no tienes solicitudes</strong>
          <p>Cuando apartes un medicamento aparecerá aquí con su folio y su fecha límite de ${HORAS_VIGENCIA_SOLICITUD} horas.</p>
          <a class="btn-primario" href="medicamentos.html">Ver medicamentos</a></div>`;
  }

  qs('#btn-simular').addEventListener('click', async () => {
    const liberadas = await casosDeUso.simularVencimiento.execute();
    qs('#resultado-demo').textContent = liberadas
      ? `Se cancelaron ${liberadas} solicitud(es) y sus unidades volvieron al inventario.`
      : 'No hay solicitudes activas para vencer.';
    notificarCambioSolicitudes();
  });

  qs('#btn-borrar').addEventListener('click', async () => {
    if (!window.confirm('Se borrarán todas las solicitudes de prueba guardadas en este navegador.')) return;
    await casosDeUso.limpiarSolicitudes.execute();
    qs('#resultado-demo').textContent = 'Datos de prueba borrados.';
    notificarCambioSolicitudes();
  });

  await pintar();
  window.addEventListener(EVENTO_SOLICITUDES, pintar);
}
