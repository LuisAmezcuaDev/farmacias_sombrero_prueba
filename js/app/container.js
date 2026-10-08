// Raíz de composición: único lugar que conoce las implementaciones concretas.
// Para cambiar de localStorage a una API real, solo se sustituye aquí el repositorio.
import {
  ListarCategorias,
  ListarMedicamentos,
  ListarSedes,
  ListarSolicitudes,
  ObtenerMedicamento,
  OrdenarSedesPorCercania,
} from '../application/consultas.js';
import {
  CrearSolicitud,
  LiberarSolicitudesVencidas,
  LimpiarSolicitudes,
  SimularVencimiento,
} from '../application/solicitudes.js';
import { CategoriaJsonRepository } from '../infrastructure/repositories/CategoriaJsonRepository.js';
import { MedicamentoJsonRepository } from '../infrastructure/repositories/MedicamentoJsonRepository.js';
import { SedeJsonRepository } from '../infrastructure/repositories/SedeJsonRepository.js';
import { SolicitudLocalStorageRepository } from '../infrastructure/repositories/SolicitudLocalStorageRepository.js';
import { GeolocalizacionNavegador } from '../infrastructure/services/GeolocalizacionNavegador.js';
import { NotificacionSimulada } from '../infrastructure/services/NotificacionSimulada.js';

const medicamentoRepo = new MedicamentoJsonRepository();
const categoriaRepo = new CategoriaJsonRepository();
const sedeRepo = new SedeJsonRepository();
const solicitudRepo = new SolicitudLocalStorageRepository();
const notificador = new NotificacionSimulada();

const liberarSolicitudesVencidas = new LiberarSolicitudesVencidas({ solicitudRepo });

export const geolocalizacion = new GeolocalizacionNavegador();

export const casosDeUso = {
  listarCategorias: new ListarCategorias({ categoriaRepo }),
  listarSedes: new ListarSedes({ sedeRepo }),
  listarMedicamentos: new ListarMedicamentos({ medicamentoRepo, solicitudRepo }),
  obtenerMedicamento: new ObtenerMedicamento({ medicamentoRepo, solicitudRepo }),
  ordenarSedesPorCercania: new OrdenarSedesPorCercania(),
  listarSolicitudes: new ListarSolicitudes({ solicitudRepo }),
  crearSolicitud: new CrearSolicitud({ medicamentoRepo, sedeRepo, solicitudRepo, notificador }),
  liberarSolicitudesVencidas,
  simularVencimiento: new SimularVencimiento({ solicitudRepo, liberarVencidas: liberarSolicitudesVencidas }),
  limpiarSolicitudes: new LimpiarSolicitudes({ solicitudRepo }),
};
