// Base para repositorios que leen un archivo JSON estático (con caché en memoria).
export class JsonRepository {
  constructor(url, clave) {
    this.url = url;
    this.clave = clave;
    this._cache = null;
  }

  async _cargar() {
    if (!this._cache) {
      const respuesta = await fetch(this.url);
      if (!respuesta.ok) throw new Error(`No se pudo cargar ${this.url} (${respuesta.status})`);
      const datos = await respuesta.json();
      this._cache = datos[this.clave];
    }
    return this._cache;
  }
}
