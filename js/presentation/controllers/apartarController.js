import { casosDeUso, geolocalizacion } from '../../app/container.js';
import { ErrorDeValidacion } from '../../domain/errores.js';
import { notificarCambioSolicitudes, qs, qsa } from '../utils/dom.js';
import { activarFallbackImagenes } from '../views/medicamentoView.js';
import {
  opcionesCantidad,
  vistaConfirmacion,
  vistaFormulario,
  vistaListaSedes,
  vistaModal,
  vistaSinExistencias,
} from '../views/modalApartarView.js';

let modalAbierto = false;

/** Escucha clics en "Apartar" dentro de un contenedor (funciona aunque se vuelva a pintar). */
export function vincularApartar(contenedor) {
  contenedor.addEventListener('click', (e) => {
    const boton = e.target.closest('[data-accion="apartar"]');
    if (boton && !boton.disabled) abrirModalApartar(boton.dataset.id, boton);
  });
}

async function abrirModalApartar(medicamentoId, disparador) {
  if (modalAbierto) return;
  modalAbierto = true;

  const [medicamento, sedes, categorias] = await Promise.all([
    casosDeUso.obtenerMedicamento.execute(medicamentoId),
    casosDeUso.listarSedes.execute(),
    casosDeUso.listarCategorias.execute(),
  ]);
  if (!medicamento) {
    modalAbierto = false;
    return;
  }

  const nombreCategoria = categorias.find((c) => c.id === medicamento.categoria)?.nombre ?? '';
  let opciones = sedes
    .map((s) => ({ ...s, disponibles: medicamento.farmacias.find((f) => f.sedeId === s.id)?.disponibles ?? 0 }))
    .filter((s) => s.disponibles > 0);

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = vistaModal({
    titulo: 'Apartar medicamento',
    cuerpo: opciones.length
      ? vistaFormulario({ medicamento, nombreCategoria, opciones })
      : vistaSinExistencias(medicamento.nombre),
  });
  document.body.append(overlay);
  document.body.classList.add('sin-scroll');
  activarFallbackImagenes(overlay);

  let urlPrevisualizacion = null;
  const cerrar = () => {
    if (urlPrevisualizacion) URL.revokeObjectURL(urlPrevisualizacion);
    document.removeEventListener('keydown', alTeclear);
    overlay.remove();
    document.body.classList.remove('sin-scroll');
    modalAbierto = false;
    disparador?.focus();
  };
  const alTeclear = (e) => {
    if (e.key === 'Escape') cerrar();
    if (e.key === 'Tab') atraparFoco(e, overlay);
  };
  document.addEventListener('keydown', alTeclear);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.closest('[data-cerrar]')) cerrar();
  });

  const form = qs('.form-apartar', overlay);
  if (!form) {
    qs('[data-cerrar]', overlay)?.focus();
    return;
  }
  (form.elements.nombre).focus();

  const sedeSeleccionada = () => form.elements.sede.value || null;
  const actualizarCantidad = () => {
    const actual = Number(form.elements.cantidad.value) || 1;
    const sede = opciones.find((s) => s.id === sedeSeleccionada());
    form.elements.cantidad.innerHTML = opcionesCantidad(sede ? sede.disponibles : 1, actual);
  };
  form.addEventListener('change', (e) => {
    if (e.target.name === 'sede') actualizarCantidad();
    if (e.target.name === 'ine') previsualizarIne(e.target.files[0]);
  });

  function previsualizarIne(archivo) {
    const img = qs('#ine-preview', form);
    if (urlPrevisualizacion) URL.revokeObjectURL(urlPrevisualizacion);
    urlPrevisualizacion = archivo && archivo.type.startsWith('image/') ? URL.createObjectURL(archivo) : null;
    img.hidden = !urlPrevisualizacion;
    if (urlPrevisualizacion) img.src = urlPrevisualizacion;
  }

  qs('#btn-ubicacion', form).addEventListener('click', async () => {
    const estado = qs('#estado-ubicacion', form);
    estado.textContent = 'Buscando tu ubicación...';
    try {
      const posicion = await geolocalizacion.obtenerPosicion();
      opciones = casosDeUso.ordenarSedesPorCercania.execute(opciones, posicion);
      qs('#lista-sedes', form).innerHTML = vistaListaSedes(opciones, opciones[0].id);
      actualizarCantidad();
      estado.textContent = 'Listo: ordenamos las farmacias de la más cercana a la más lejana.';
    } catch (err) {
      estado.textContent = err.message;
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    limpiarErrores(form);
    const datos = new FormData(form);
    const archivo = form.elements.ine.files[0];
    try {
      const resultado = await casosDeUso.crearSolicitud.execute({
        medicamentoId: medicamento.id,
        sedeId: datos.get('sede'),
        cantidad: Number(datos.get('cantidad')),
        solicitante: {
          nombre: datos.get('nombre') ?? '',
          telefono: datos.get('telefono') ?? '',
          correo: datos.get('correo') ?? '',
          direccion: datos.get('direccion') ?? '',
        },
        ineArchivo: archivo ? { nombre: archivo.name, tipo: archivo.type, tamano: archivo.size } : null,
      });
      qs('#modal-titulo', overlay).textContent = 'Listo';
      qs('#modal-cuerpo', overlay).innerHTML = vistaConfirmacion(resultado);
      qs('#modal-cuerpo', overlay).scrollTop = 0;
      qs('[data-cerrar].btn-primario', overlay)?.focus();
      notificarCambioSolicitudes();
    } catch (err) {
      if (err instanceof ErrorDeValidacion) mostrarErrores(form, err.errores);
      else mostrarErrores(form, { general: err.message });
    }
  });
}

function limpiarErrores(form) {
  qsa('[data-error-for]', form).forEach((p) => (p.textContent = ''));
}

function mostrarErrores(form, errores) {
  Object.entries(errores).forEach(([campo, mensaje]) => {
    const destino = qs(`[data-error-for="${campo}"]`, form);
    if (destino) destino.textContent = mensaje;
  });
  const primero = qs('[data-error-for]:not(:empty)', form);
  primero?.scrollIntoView({ block: 'center', behavior: 'smooth' });
}

function atraparFoco(evento, contenedor) {
  const enfocables = qsa('a[href],button:not([disabled]),input:not([disabled]),select,textarea', contenedor).filter(
    (el) => el.offsetParent !== null
  );
  if (!enfocables.length) return;
  const primero = enfocables[0];
  const ultimo = enfocables[enfocables.length - 1];
  if (evento.shiftKey && document.activeElement === primero) {
    evento.preventDefault();
    ultimo.focus();
  } else if (!evento.shiftKey && document.activeElement === ultimo) {
    evento.preventDefault();
    primero.focus();
  }
}
