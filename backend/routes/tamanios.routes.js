import { Router } from 'express';
import { getTamanios, createTamanio } from '../controllers/tamanios.controller.js';

const router = Router();

router.get('/', getTamanios);
router.post('/', createTamanio);

export default router;
