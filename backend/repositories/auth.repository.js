import { Usuario } from '../models/Usuario.js';

export class AuthRepository {
  async findByEmail(email) {
    try {
      const usuario = await Usuario.findOne({
        where: { email }
      });
      return usuario;
    } catch (error) {
      throw new Error('Error al buscar usuario: ' + error.message);
    }
  }

  async findById(id) {
    try {
      const usuario = await Usuario.findByPk(id);
      return usuario;
    } catch (error) {
      throw new Error('Error al buscar usuario por ID: ' + error.message);
    }
  }
}