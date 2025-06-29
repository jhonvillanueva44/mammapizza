import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticateToken, requireAdmin } from '../middlewares/auth.js';

const router = Router();
const authController = new AuthController();

// Rutas públicas
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Rutas protegidas
router.get('/verify', authController.verify);
router.get('/admin/check', authenticateToken, requireAdmin, (req, res) => {
  res.json({
    success: true,
    message: 'Usuario admin verificado',
    usuario: req.user
  });
});

export default router;