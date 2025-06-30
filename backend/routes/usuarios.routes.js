import { Router } from 'express';
import { getUsuarios, getUsuario } from '../controllers/usuarios.controller.js';

const router = Router();

router.get('/', getUsuarios);
router.get('/:id', getUsuario);

export default router;