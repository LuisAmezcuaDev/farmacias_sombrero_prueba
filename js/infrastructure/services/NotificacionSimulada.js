import { HORAS_VIGENCIA_SOLICITUD } from '../../domain/politicas.js';
import { formatearFecha } from '../../shared/texto.js';

// Simula el envío de correo y mensaje de texto. En producción se reemplaza por
// un proveedor real (correo transaccional y SMS/WhatsApp) desde un servidor.
export class NotificacionSimulada {
  async enviarConfirmacion({ solicitud }) {
    const limite = formatearFecha(solicitud.venceEn);
    const texto =
      `Farmacias del Sombrero (prototipo): tu solicitud ${solicitud.folio} de ` +
      `${solicitud.cantidad} unidad(es) de ${solicitud.medicamentoNombre} quedó registrada. ` +
      `Recógela en ${solicitud.sedeNombre} (fecha límite: ${limite}). ` +
      `Pasadas ${HORAS_VIGENCIA_SOLICITUD} horas la solicitud se cancela y el medicamento se libera.`;

    return {
      simulado: true,
      destinos: {
        correo: solicitud.solicitante.correoEnmascarado,
        telefono: solicitud.solicitante.telefonoEnmascarado,
      },
      texto,
    };
  }
}
