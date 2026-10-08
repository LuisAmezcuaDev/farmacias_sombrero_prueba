import { escapar } from '../utils/dom.js';
import { icono, logoSombrero } from './iconos.js';

const ENLACES = [
  { id: 'servicios', href: 'servicios.html', texto: 'Servicios' },
  { id: 'nosotros', href: 'nosotros.html', texto: 'Nosotros' },
  { id: 'sedes', href: 'sedes.html', texto: 'Sedes' },
  { id: 'como-ayudar', href: 'como-ayudar.html', texto: 'Cómo ayudar' },
  { id: 'contacto', href: 'contacto.html', texto: 'Contacto' },
];

const marca = () =>
  `<a href="index.html" class="marca" aria-label="Farmacias del Sombrero, ir al inicio">${logoSombrero(32)}<span>Farmacias del <em>Sombrero</em></span></a>`;

function menuMedicamentos(categorias, pagina) {
  const items = categorias
    .map(
      (c) => `<li><a href="medicamentos.html?categoria=${escapar(c.id)}">
        <span class="mega-icono">${icono(c.icono, 20)}</span>
        <span>${escapar(c.nombre)}<small>${escapar(c.descripcion)}</small></span></a></li>`
    )
    .join('');
  return `<li class="tiene-submenu">
    <button type="button" class="nav-boton ${pagina === 'medicamentos' ? 'activo' : ''}" aria-expanded="false" aria-controls="mega-medicamentos">
      Medicamentos ${icono('chevron', 16)}
    </button>
    <div class="mega" id="mega-medicamentos">
      <div class="mega-inner contenedor">
        <ul class="mega-lista">${items}</ul>
        <a class="mega-todo" href="medicamentos.html">Ver todo el catálogo →</a>
      </div>
    </div>
  </li>`;
}

export function renderizarLayout({ pagina, categorias }) {
  const aviso = document.getElementById('site-disclaimer');
  const header = document.getElementById('site-header');
  const footer = document.getElementById('site-footer');

  if (aviso) {
    aviso.className = 'disclaimer';
    aviso.innerHTML =
      'Esta es una <strong>propuesta conceptual, no oficial</strong>, creada de manera independiente como muestra de interés. No representa al ayuntamiento de Uruapan ni al Movimiento del Sombrero.';
  }

  if (header) {
    const enlaces = ENLACES.map(
      (e) => `<li><a href="${e.href}" data-page="${e.id}" ${pagina === e.id ? 'class="activo" aria-current="page"' : ''}>${e.texto}</a></li>`
    ).join('');
    header.innerHTML = `<div class="nav contenedor">
      ${marca()}
      <nav aria-label="Principal">
        <ul class="nav-links" id="nav-links-principal">${menuMedicamentos(categorias, pagina)}${enlaces}</ul>
      </nav>
      <a class="nav-solicitudes ${pagina === 'solicitudes' ? 'activo' : ''}" href="solicitudes.html">
        <span><span class="texto-largo">Mis </span>solicitudes</span>
        <span class="badge" id="badge-solicitudes" hidden>0</span>
      </a>
      <button type="button" class="menu-btn" aria-label="Abrir menú" aria-expanded="false" aria-controls="nav-links-principal">${icono('menu', 26)}</button>
    </div>`;
  }

  if (footer) {
    const enlacesFooter = ENLACES.map((e) => `<li><a href="${e.href}">${e.texto}</a></li>`).join('');
    const cats = categorias
      .map((c) => `<li><a href="medicamentos.html?categoria=${escapar(c.id)}">${escapar(c.nombre)}</a></li>`)
      .join('');
    footer.innerHTML = `<div class="contenedor">
      <div class="footer-grid">
        <div>${marca()}<p>Programa de salud comunitaria en Uruapan, Michoacán. Medicamento y atención médica sin costo.</p></div>
        <div><h3>Medicamentos</h3><ul>${cats}</ul></div>
        <div><h3>El proyecto</h3><ul>${enlacesFooter}<li><a href="solicitudes.html">Mis solicitudes</a></li></ul></div>
      </div>
      <p class="footer-legal">Propuesta conceptual y no oficial, elaborada de manera independiente como muestra de interés. No representa al ayuntamiento de Uruapan, al DIF municipal, ni al Movimiento del Sombrero. Existencias y sedes mostradas son datos de ejemplo.</p>
    </div>`;
  }
}
