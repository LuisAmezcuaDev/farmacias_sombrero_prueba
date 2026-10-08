import { qs } from '../utils/dom.js';

/** Formulario de contacto del prototipo: no envía datos a ningún lado. */
export function iniciarFormularioContacto() {
  const form = qs('.contacto-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    form.innerHTML = `<div class="gracias" role="status"><strong>Gracias por tu mensaje</strong>
      <p>Este formulario es parte de un prototipo conceptual: tu mensaje no se envió a ninguna instancia oficial.</p></div>`;
  });
}
