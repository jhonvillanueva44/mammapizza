import { Router } from 'express';
import {
  getTamaniosSabores,
  createTamanioSabor,
  updateTamanioSabor,
  deleteTamanioSabor
} from '../controllers/tamanioSabor.controller.js';

const router = Router();

router.get('/', getTamaniosSabores);
router.post('/', createTamanioSabor);
router.put('/:id', updateTamanioSabor);
router.delete('/:id', deleteTamanioSabor);


export default router;
