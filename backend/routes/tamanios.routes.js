import { Router } from 'express';
import {
  getTamanios,
  createTamanio,
  updateTamanio,
  deleteTamanio,
  getTamaniosPizza,
  getTamaniosCalzone,
  getTamaniosPasta,
  getTamaniosAgregado
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

export default router;
