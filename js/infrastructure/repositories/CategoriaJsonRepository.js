import { JsonRepository } from './JsonRepository.js';

export class CategoriaJsonRepository extends JsonRepository {
  constructor(url = 'data/categorias.json') {
    super(url, 'categorias');
  }
  obtenerTodas() {
    return this._cargar();
  }
}
