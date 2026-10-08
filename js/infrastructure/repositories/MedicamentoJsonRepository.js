import { JsonRepository } from './JsonRepository.js';

export class MedicamentoJsonRepository extends JsonRepository {
  constructor(url = 'data/medicamentos.json') {
    super(url, 'medicamentos');
  }
  obtenerTodos() {
    return this._cargar();
  }
  async obtenerPorId(id) {
    const todos = await this._cargar();
    return todos.find((m) => m.id === id) ?? null;
  }
}
