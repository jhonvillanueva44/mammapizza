import { AuthService } from '../services/auth.service.js';

const authService = new AuthService();

export const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token no encontrado'
      });
    }

    const usuario = await authService.verifyToken(token);
    req.user = usuario;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requiere rol de administrador'
    });
  }
  next();
};