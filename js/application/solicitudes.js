// Casos de uso de escritura sobre solicitudes de apartado.
import { aplicarApartados } from '../domain/disponibilidad.js';
import { ErrorDeNegocio, ErrorDeValidacion } from '../domain/errores.js';
import { MAX_UNIDADES_POR_SOLICITUD, ESTADOS_SOLICITUD } from '../domain/politicas.js';
import {
  cancelarPorVencimiento,
  crearSolicitud,
  estaVencida,
  validarSolicitud,
} from '../domain/solicitud.js';

export class CrearSolicitud {
  constructor({ medicamentoRepo, sedeRepo, solicitudRepo, notificador }) {
    Object.assign(this, { medicamentoRepo, sedeRepo, solicitudRepo, notificador });
  }

  async execute({ medicamentoId, sedeId, cantidad, solicitante, ineArchivo }) {
    const [base, solicitudes] = await Promise.all([
      this.medicamentoRepo.obtenerPorId(medicamentoId),
      this.solicitudRepo.obtenerTodas(),
    ]);
    if (!base) throw new ErrorDeNegocio('El medicamento ya no está disponible en el catálogo.');

    const medicamento = aplicarApartados(base, solicitudes);
    const enSede = medicamento.farmacias.find((f) => f.sedeId === sedeId);
    const maxPermitido = Math.min(MAX_UNIDADES_POR_SOLICITUD, enSede ? enSede.disponibles : 0);

    const { valido, errores } = validarSolicitud({ cantidad, maxPermitido, solicitante, sedeId, ineArchivo });
    if (!valido) throw new ErrorDeValidacion(errores);

    const sede = await this.sedeRepo.obtenerPorId(sedeId);
    if (!sede) throw new ErrorDeNegocio('La farmacia elegida no existe.');

    const solicitud = crearSolicitud({ medicamento, sede, cantidad, solicitante });
    await this.solicitudRepo.guardar(solicitud);
    const mensaje = await this.notificador.enviarConfirmacion({ solicitud, solicitante });
    return { solicitud, mensaje };
  }
}

/** Cancela las solicitudes activas que pasaron del plazo y libera sus unidades. */
export class LiberarSolicitudesVencidas {
  constructor({ solicitudRepo }) {
    this.solicitudRepo = solicitudRepo;
  }

  async execute(ahora = new Date()) {
    const todas = await this.solicitudRepo.obtenerTodas();
    let liberadas = 0;
    const actualizadas = todas.map((s) => {
      if (!estaVencida(s, ahora)) return s;
      liberadas += 1;
      return cancelarPorVencimiento(s, ahora);
    });
    if (liberadas > 0) await this.solicitudRepo.reemplazarTodas(actualizadas);
    return liberadas;
  }
}

/** Solo para la demo del prototipo: adelanta el vencimiento para mostrar la liberación. */
export class SimularVencimiento {
  constructor({ solicitudRepo, liberarVencidas }) {
    this.solicitudRepo = solicitudRepo;
    this.liberarVencidas = liberarVencidas;
  }

  async execute() {
    const ahora = new Date();
    const pasado = new Date(ahora.getTime() - 60 * 1000).toISOString();
    const todas = await this.solicitudRepo.obtenerTodas();
    const adelantadas = todas.map((s) =>
      s.estado === ESTADOS_SOLICITUD.ACTIVA ? { ...s, venceEn: pasado } : s
    );
    await this.solicitudRepo.reemplazarTodas(adelantadas);
    return this.liberarVencidas.execute(ahora);
  }
}

export class LimpiarSolicitudes {
  constructor({ solicitudRepo }) {
    this.solicitudRepo = solicitudRepo;
  }
  execute() {
    return this.solicitudRepo.eliminarTodas();
  }
}
