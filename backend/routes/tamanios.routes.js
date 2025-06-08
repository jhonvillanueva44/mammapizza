import { Router } from 'express';
import {
  getTamanios,
  createTamanio,
  updateTamanio,
  deleteTamanio
} from '../controllers/tamanios.controller.js';

const router = Router();

router.get('/', getTamanios);
router.post('/', createTamanio);
router.put('/:id', updateTamanio);
router.delete('/:id', deleteTamanio);

export default router;
