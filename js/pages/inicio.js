import { iniciarPagina } from '../app/iniciarPagina.js';
import { iniciarInicio } from '../presentation/controllers/inicioController.js';

iniciarPagina('inicio').then(iniciarInicio);
