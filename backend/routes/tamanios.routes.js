import { Router } from 'express';
import {
  getTamanios,
  createTamanio,
  updateTamanio,
  deleteTamanio,
  getTamaniosPizza,
  getTamaniosCalzone,
  getTamaniosPasta,
  getTamaniosAgregado,
  getTamaniosBebida
} from '../controllers/tamanios.controller.js';

const router = Router();

router.get('/', getTamanios);
router.post('/', createTamanio);
router.put('/:id', updateTamanio);
router.delete('/:id', deleteTamanio);
router.get('/pizza', getTamaniosPizza);
router.get('/calzone', getTamaniosCalzone);
router.get('/pasta', getTamaniosPasta);
router.get('/agregado', getTamaniosAgregado);
router.get('/bebida', getTamaniosBebida);

export default router;