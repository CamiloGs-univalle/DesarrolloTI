export class UserModel {
  constructor(nombre, edad) {
    this.nombre = nombre;
    this.edad = edad;
    this.fecha = new Date().toISOString();
  }
}
