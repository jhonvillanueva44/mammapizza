import { Router } from 'express';
import { getTipos, createTipo } from '../controllers/tipos.controller.js';

const router = Router();

router.get('/', getTipos);
router.post('/', createTipo);

export default router;