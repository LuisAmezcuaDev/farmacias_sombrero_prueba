// Páginas de contenido (servicios, nosotros, sedes, cómo ayudar, contacto).
import { iniciarPagina } from '../app/iniciarPagina.js';
import { iniciarFormularioContacto } from '../presentation/controllers/contactoController.js';

iniciarPagina(document.body.dataset.page).then(iniciarFormularioContacto);
