import { qs, qsa } from '../utils/dom.js';

/** Acordeón de preguntas frecuentes (cada página trae sus propias 3 a 5 preguntas). */
export function iniciarAcordeon() {
  qsa('.faq-pregunta').forEach((boton) => {
    boton.setAttribute('aria-expanded', 'false');
    boton.addEventListener('click', () => {
      const item = boton.closest('.faq-item');
      const estabaAbierto = item.classList.contains('abierto');
      qsa('.faq-item.abierto').forEach((i) => {
        i.classList.remove('abierto');
        qs('.faq-pregunta', i).setAttribute('aria-expanded', 'false');
      });
      if (!estabaAbierto) {
        item.classList.add('abierto');
        boton.setAttribute('aria-expanded', 'true');
      }
    });
  });
}
