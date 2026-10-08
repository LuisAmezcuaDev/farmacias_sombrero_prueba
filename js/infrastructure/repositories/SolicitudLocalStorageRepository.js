// Persistencia de solicitudes en el navegador. En producción se reemplaza por una API,
// manteniendo estos mismos métodos para no tocar los casos de uso.
const CLAVE = 'fds.solicitudes.v1';

export class SolicitudLocalStorageRepository {
  async obtenerTodas() {
    try {
      const crudo = localStorage.getItem(CLAVE);
      return crudo ? JSON.parse(crudo) : [];
    } catch {
      return [];
    }
  }

  async guardar(solicitud) {
    const todas = await this.obtenerTodas();
    todas.push(solicitud);
    this._escribir(todas);
  }

  async reemplazarTodas(lista) {
    this._escribir(lista);
  }

  async eliminarTodas() {
    try {
      localStorage.removeItem(CLAVE);
    } catch {
      /* sin almacenamiento disponible */
    }
  }

  _escribir(lista) {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(lista));
    } catch {
      /* sin almacenamiento disponible */
    }
  }
}
