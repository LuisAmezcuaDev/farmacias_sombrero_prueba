import { iniciarPagina } from '../app/iniciarPagina.js';
import { iniciarCatalogo } from '../presentation/controllers/catalogoController.js';

iniciarPagina('medicamentos').then(iniciarCatalogo);
