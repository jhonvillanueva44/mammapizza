import { Router } from 'express';
import { getTamaniosSabores, createTamanioSabor } from '../controllers/tamanioSabor.controller.js';

const router = Router();

router.get('/', getTamaniosSabores);
router.post('/', createTamanioSabor);

export default router;
