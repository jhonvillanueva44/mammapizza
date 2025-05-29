import { Router } from 'express';
import { getInventarios, createInventario } from '../controllers/inventarios.controller.js';

const router = Router();

router.get('/', getInventarios);
router.post('/', createInventario);

export default router;