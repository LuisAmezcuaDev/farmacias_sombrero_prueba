export class ErrorDeValidacion extends Error {
  constructor(errores) {
    super('Hay datos que corregir.');
    this.name = 'ErrorDeValidacion';
    this.errores = errores;
  }
}

export class ErrorDeNegocio extends Error {
  constructor(mensaje) {
    super(mensaje);
    this.name = 'ErrorDeNegocio';
  }
}
