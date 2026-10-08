// Casos de uso de lectura. Dependen de puertos (repositorios) inyectados, no de implementaciones.
import { aplicarApartados } from '../domain/disponibilidad.js';
import { distanciaKm } from '../domain/geo.js';
import { normalizar } from '../shared/texto.js';

export class ListarCategorias {
  constructor({ categoriaRepo }) {
    this.categoriaRepo = categoriaRepo;
  }
  execute() {
    return this.categoriaRepo.obtenerTodas();
  }
}

export class ListarSedes {
  constructor({ sedeRepo }) {
    this.sedeRepo = sedeRepo;
  }
  execute() {
    return this.sedeRepo.obtenerTodas();
  }
}

export class ListarMedicamentos {
  constructor({ medicamentoRepo, solicitudRepo }) {
    this.medicamentoRepo = medicamentoRepo;
    this.solicitudRepo = solicitudRepo;
  }

  async execute({ categoria = null, texto = '', soloPopulares = false } = {}) {
    const [medicamentos, solicitudes] = await Promise.all([
      this.medicamentoRepo.obtenerTodos(),
      this.solicitudRepo.obtenerTodas(),
    ]);
    const busqueda = normalizar(texto);

    return medicamentos
      .filter((m) => !categoria || m.categoria === categoria)
      .filter((m) => !soloPopulares || m.popular)
      .filter(
        (m) =>
          !busqueda ||
          normalizar(`${m.nombre} ${m.presentacion} ${m.descripcion}`).includes(busqueda)
      )
      .map((m) => aplicarApartados(m, solicitudes));
  }
}

export class ObtenerMedicamento {
  constructor({ medicamentoRepo, solicitudRepo }) {
    this.medicamentoRepo = medicamentoRepo;
    this.solicitudRepo = solicitudRepo;
  }

  async execute(id) {
    const [medicamento, solicitudes] = await Promise.all([
      this.medicamentoRepo.obtenerPorId(id),
      this.solicitudRepo.obtenerTodas(),
    ]);
    return medicamento ? aplicarApartados(medicamento, solicitudes) : null;
  }
}

export class OrdenarSedesPorCercania {
  /** Agrega distanciaKm a cada sede y las ordena de la más cercana a la más lejana. */
  execute(sedes, posicion) {
    return sedes
      .map((s) => ({ ...s, distanciaKm: distanciaKm(posicion, s) }))
      .sort((a, b) => a.distanciaKm - b.distanciaKm);
  }
}

export class ListarSolicitudes {
  constructor({ solicitudRepo }) {
    this.solicitudRepo = solicitudRepo;
  }
  async execute() {
    const todas = await this.solicitudRepo.obtenerTodas();
    return [...todas].sort((a, b) => new Date(b.creadaEn) - new Date(a.creadaEn));
  }
}
