import { Router } from 'express';
import { getCombinaciones, createCombinacion } from '../controllers/combinaciones.controller.js';

const router = Router();

router.get('/', getCombinaciones);
router.post('/', createCombinacion);

export default router;
