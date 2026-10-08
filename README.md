# Farmacias del Sombrero (propuesta conceptual, no oficial)

Prototipo de sitio para un programa de salud comunitaria. No usa el logo ni el nombre registrados del movimiento; solo alude al sombrero como símbolo cultural. Los medicamentos, inventarios y sedes son **datos de ejemplo**.

## Cómo ejecutarlo

El sitio usa módulos ES y `fetch` de archivos JSON, así que **no funciona abriendo el HTML con doble clic (file://)**.

- En VS Code: instala la extensión Live Server y usa "Open with Live Server" sobre `index.html`.
- En GitHub Pages: sube la carpeta tal cual (todas las rutas son relativas).
- Con Python: `python3 -m http.server 8000` y abre `http://localhost:8000`.

## Arquitectura (Clean Architecture + MVC en la capa de presentación)

Las dependencias apuntan hacia adentro: presentación e infraestructura conocen a la aplicación y al dominio; el dominio no conoce a nadie.

```
js/
  domain/            Reglas puras, sin DOM ni red
    politicas.js       máximo 3 unidades, 72 horas, límites de la foto INE
    solicitud.js       validar, crear, folio, vencimiento, enmascarar datos
    disponibilidad.js  unidades disponibles = inventario menos apartados activos
    geo.js             distancia entre dos puntos (Haversine)
    errores.js
  application/       Casos de uso (reciben sus dependencias inyectadas)
    consultas.js       ListarCategorias, ListarMedicamentos, OrdenarSedesPorCercania...
    solicitudes.js     CrearSolicitud, LiberarSolicitudesVencidas, SimularVencimiento...
  infrastructure/    Detalles reemplazables
    repositories/      JSON estático y localStorage
    services/          NotificacionSimulada, GeolocalizacionNavegador
  presentation/      MVC
    views/             HTML que se dibuja (header, tarjetas, carrusel, modal)
    controllers/       Eventos del usuario, llaman a los casos de uso
    utils/dom.js
  app/               Raíz de composición
    container.js       aquí se arman repositorios, servicios y casos de uso
    iniciarPagina.js
  pages/             Un punto de entrada por página HTML
  shared/texto.js
css/                 tokens, base, layout, components, catalogo, responsive
data/                medicamentos.json, categorias.json, sedes.json
assets/img/medicamentos/   imágenes (una por medicamento)
*.html               index, medicamentos, solicitudes, servicios, nosotros, sedes, como-ayudar, contacto
```

## Reglas del apartado (prototipo)

- Máximo 3 unidades por solicitud.
- Las unidades disponibles se calculan restando las solicitudes activas al inventario.
- Cada solicitud vence a las 72 horas. Al cargar cualquier página se liberan las vencidas y las unidades regresan al inventario.
- Solo se guarda nombre, folio, medicamento, sede y versiones enmascaradas de correo y teléfono. La dirección y la foto de INE no se guardan (la INE solo se previsualiza en el navegador).
- La confirmación por correo o mensaje es simulada y se muestra en pantalla.
- En "Mis solicitudes" hay botones de demostración para simular que pasaron 72 horas y para borrar los datos.

## Formato de `data/medicamentos.json`

```json
{
  "id": "paracetamol-500",
  "nombre": "Paracetamol 500 mg",
  "presentacion": "Caja con 20 tabletas",
  "descripcion": "Texto corto de uso general.",
  "categoria": "dolor-fiebre",
  "requiereReceta": false,
  "popular": true,
  "caducidad": "2027-08-31",
  "inventario": 120,
  "farmacias": [{ "sedeId": "uruapan-1", "unidades": 40 }],
  "imagen": "assets/img/medicamentos/paracetamol-500.webp"
}
```

`inventario` debe ser la suma de `farmacias[].unidades`. Las categorías están en `data/categorias.json` y las sedes en `data/sedes.json` (coordenadas ilustrativas, reemplázalas con las reales).

## Cómo agregar las imágenes

1. Usa fotos propias del empaque real (las toma el programa) o ilustraciones con licencia. No copies imágenes de Fahorro, Farmacias Similares ni de marcas, tienen derechos de autor.
2. Formato cuadrado, fondo blanco o neutro, 600 x 600 px, `.webp`, menos de 100 KB.
3. Nombra cada archivo exactamente como el `id` del medicamento, por ejemplo `paracetamol-500.webp`.
4. Colócalo en `assets/img/medicamentos/`.
5. Si falta un archivo, se muestra `placeholder.svg` automáticamente.

## Pasar a un backend real

Solo cambian las piezas de infraestructura y el archivo `app/container.js`:

- `SolicitudLocalStorageRepository` por un repositorio que llame a una API.
- `NotificacionSimulada` por un proveedor real de correo y SMS o WhatsApp.
- La foto de INE debe subirse a almacenamiento seguro desde un servidor, nunca desde el navegador a un sitio público.
- La expiración de 72 horas debe ejecutarse en el servidor (tarea programada).

El dominio y los casos de uso se reutilizan sin cambios.

## ¿Seguir con HTML/CSS/JS o pasar a Next.js?

Para este prototipo conviene **seguir con HTML, CSS y módulos JS**: se despliega en GitHub Pages sin compilar y la arquitectura ya está separada por capas. Next.js vale la pena cuando haya backend real: cuentas, base de datos, envío de SMS/correo, almacenamiento seguro de INE o SEO del catálogo. Con exportación estática en GitHub Pages Next.js no ejecuta rutas de API y requiere `basePath` y GitHub Actions, por lo que hoy no aportaría ventaja.
