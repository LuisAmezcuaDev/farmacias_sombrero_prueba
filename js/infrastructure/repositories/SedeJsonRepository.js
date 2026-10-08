import { JsonRepository } from './JsonRepository.js';

export class SedeJsonRepository extends JsonRepository {
  constructor(url = 'data/sedes.json') {
    super(url, 'sedes');
  }
  obtenerTodas() {
    return this._cargar();
  }
  async obtenerPorId(id) {
    const todas = await this._cargar();
    return todas.find((s) => s.id === id) ?? null;
  }
}
