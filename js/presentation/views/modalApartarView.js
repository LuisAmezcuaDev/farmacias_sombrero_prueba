import { HORAS_VIGENCIA_SOLICITUD, MAX_UNIDADES_POR_SOLICITUD } from '../../domain/politicas.js';
import { formatearFecha } from '../../shared/texto.js';
import { escapar } from '../utils/dom.js';
import { icono } from './iconos.js';

const PLACEHOLDER = 'assets/img/medicamentos/placeholder.svg';

export function vistaModal({ titulo, cuerpo }) {
  return `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
    <div class="modal-cabecera">
      <h2 id="modal-titulo">${escapar(titulo)}</h2>
      <button type="button" class="modal-cerrar" data-cerrar aria-label="Cerrar ventana">${icono('cerrar', 22)}</button>
    </div>
    <div class="modal-cuerpo" id="modal-cuerpo">${cuerpo}</div>
  </div>`;
}

export function opcionesCantidad(max, seleccionada = 1) {
  const tope = Math.max(1, Math.min(MAX_UNIDADES_POR_SOLICITUD, max));
  return Array.from({ length: tope }, (_, i) => i + 1)
    .map((n) => `<option value="${n}" ${n === Math.min(seleccionada, tope) ? 'selected' : ''}>${n}</option>`)
    .join('');
}

export function vistaListaSedes(opciones, seleccionId) {
  return opciones
    .map((s, i) => {
      const cercana = s.distanciaKm !== undefined && i === 0;
      const distancia = s.distanciaKm !== undefined ? ` · a ${s.distanciaKm.toFixed(1)} km` : '';
      return `<label class="sede-opcion">
        <input type="radio" name="sede" value="${escapar(s.id)}" ${s.id === seleccionId ? 'checked' : ''}>
        <span><strong>${escapar(s.nombre)} ${cercana ? '<span class="sede-cercana">(la más cercana)</span>' : ''}</strong>
        <small>${escapar(s.zona)}${distancia} · ${s.disponibles} disponible(s)</small></span>
      </label>`;
    })
    .join('');
}

export function vistaFormulario({ medicamento, nombreCategoria, opciones }) {
  const primera = opciones[0];
  return `<form class="form-apartar" novalidate>
    <div class="resumen-med">
      <img src="${escapar(medicamento.imagen)}" alt="" data-fallback="${PLACEHOLDER}">
      <div><strong>${escapar(medicamento.nombre)}</strong>
      <span>${escapar(medicamento.presentacion)}<br>${escapar(nombreCategoria)}</span></div>
    </div>
    ${
      medicamento.requiereReceta
        ? '<p class="aviso">Este medicamento requiere receta. Lleva la tuya al recogerlo; si no cuentas con una, se hará una valoración clínica en la farmacia.</p>'
        : ''
    }

    <fieldset class="campo">
      <legend>Farmacia donde lo recogerás</legend>
      <button type="button" class="btn-texto" id="btn-ubicacion" style="text-align:left">${icono('ubicacion', 16)} Usar mi ubicación para elegir la más cercana</button>
      <p class="ayuda" id="estado-ubicacion" aria-live="polite"></p>
      <div class="lista-sedes" id="lista-sedes">${vistaListaSedes(opciones, primera.id)}</div>
      <p class="error" data-error-for="sede"></p>
    </fieldset>

    <div class="campo">
      <label for="ap-cantidad">Cantidad (máximo ${MAX_UNIDADES_POR_SOLICITUD} por solicitud)</label>
      <select id="ap-cantidad" name="cantidad">${opcionesCantidad(primera.disponibles)}</select>
      <p class="error" data-error-for="cantidad"></p>
    </div>

    <div class="campo-fila">
      <div class="campo">
        <label for="ap-nombre">Nombre completo</label>
        <input id="ap-nombre" name="nombre" type="text" autocomplete="name">
        <p class="error" data-error-for="nombre"></p>
      </div>
      <div class="campo">
        <label for="ap-telefono">Teléfono (10 dígitos)</label>
        <input id="ap-telefono" name="telefono" type="tel" inputmode="numeric" autocomplete="tel">
        <p class="error" data-error-for="telefono"></p>
      </div>
    </div>
    <div class="campo">
      <label for="ap-correo">Correo electrónico</label>
      <input id="ap-correo" name="correo" type="email" autocomplete="email">
      <p class="error" data-error-for="correo"></p>
    </div>
    <div class="campo">
      <label for="ap-direccion">Dirección</label>
      <input id="ap-direccion" name="direccion" type="text" autocomplete="street-address">
      <p class="error" data-error-for="direccion"></p>
    </div>
    <div class="campo">
      <label for="ap-ine">Foto de tu INE (frente)</label>
      <input id="ap-ine" name="ine" type="file" accept="image/jpeg,image/png,image/webp">
      <img class="ine-preview" id="ine-preview" alt="Vista previa de tu INE" hidden>
      <p class="error" data-error-for="ine"></p>
    </div>

    <p class="aviso-prototipo">Prototipo: los datos no se envían a ningún servidor y la foto de tu INE solo se previsualiza en tu navegador, no se guarda. Existencias y farmacias son de ejemplo.</p>
    <p class="error" data-error-for="general" role="alert"></p>
    <button type="submit" class="btn-primario btn-bloque">Confirmar solicitud</button>
  </form>`;
}

export function vistaSinExistencias(nombre) {
  return `<div class="vacio"><strong>${escapar(nombre)} no tiene existencias por ahora</strong>
    <p>Vuelve a consultar más tarde, otra persona pudo haberlo apartado.</p>
    <button type="button" class="btn-primario" data-cerrar>Entendido</button></div>`;
}

export function vistaConfirmacion({ solicitud, mensaje }) {
  return `<div class="confirmacion">
    <div class="confirmacion-icono">${icono('check', 32)}</div>
    <h3>Solicitud registrada</h3>
    <p>Tu folio es <strong class="folio">${escapar(solicitud.folio)}</strong></p>
    <dl class="datos-confirmacion">
      <dt>Medicamento</dt><dd>${escapar(solicitud.medicamentoNombre)}</dd>
      <dt>Cantidad</dt><dd>${solicitud.cantidad}</dd>
      <dt>Farmacia</dt><dd>${escapar(solicitud.sedeNombre)}</dd>
      <dt>Recógelo antes de</dt><dd>${escapar(formatearFecha(solicitud.venceEn))}</dd>
    </dl>
    <p class="aviso-plazo">Tienes <strong>${HORAS_VIGENCIA_SOLICITUD} horas</strong> para pasar por tu medicamento. Si no lo haces, la solicitud se cancela y el medicamento se libera para otras personas.</p>
    <div class="mensaje-simulado">
      <p class="etiqueta">Mensaje simulado enviado a ${escapar(mensaje.destinos.correo)} y ${escapar(mensaje.destinos.telefono)}</p>
      <blockquote>${escapar(mensaje.texto)}</blockquote>
    </div>
    <div class="acciones">
      <a class="btn-secundario" href="solicitudes.html">Ver mis solicitudes</a>
      <button type="button" class="btn-primario" data-cerrar>Listo</button>
    </div>
  </div>`;
}
