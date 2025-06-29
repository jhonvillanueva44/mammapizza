import { AuthService } from '../services/auth.service.js';
import config from "../config/config.js";

export class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email y contraseña son requeridos'
        });
      }

      const result = await this.authService.login(email, password);

      res.cookie('authToken', result.token, {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 
      });

      res.json({
        success: true,
        message: 'Login exitoso',
        usuario: result.usuario
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  };

  logout = async (req, res) => {
    try {
      res.clearCookie('authToken');
      res.json({
        success: true,
        message: 'Logout exitoso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al cerrar sesión'
      });
    }
  };

  verify = async (req, res) => {
    try {
      const token = req.cookies.authToken;

      if (!token) {

        return res.status(401).json({
          success: false,
          message: 'No hay token'
        });
      }

      const usuario = await this.authService.verifyToken(token);

      res.json({
        success: true,
        usuario
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  };
}