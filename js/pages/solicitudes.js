import { iniciarPagina } from '../app/iniciarPagina.js';
import { iniciarSolicitudes } from '../presentation/controllers/solicitudesController.js';

iniciarPagina('solicitudes').then(iniciarSolicitudes);
