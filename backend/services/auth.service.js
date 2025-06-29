import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthRepository } from '../repositories/auth.repository.js';
import config from "../config/config.js";

export class AuthService {
  constructor() {
    this.authRepository = new AuthRepository();
  }

  async login(email, password) {
    try {

      const usuario = await this.authRepository.findByEmail(email);
      
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      if (!usuario.estado) {
        throw new Error('Usuario inactivo');
      }

      const isValidPassword = await bcrypt.compare(password, usuario.password);
      if (!isValidPassword) {
        throw new Error('Contraseña incorrecta');
      }

      const token = jwt.sign(
        { 
          id: usuario.id, 
          email: usuario.email, 
          rol: usuario.rol 
        },
        config.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return {
        token,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol
        }
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      
      const usuario = await this.authRepository.findById(decoded.id);

      
      if (!usuario || !usuario.estado) {
        throw new Error('Usuario no válido');
      }

      return {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      };
    } catch (error) {
      throw new Error('Token inválido: ' + error.message);
    }
  }
}