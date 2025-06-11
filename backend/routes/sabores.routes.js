import { Router } from 'express';
import {
  getSabores,
  createSabor,
  updateSabor,
  deleteSabor,
  getSaboresPizza,
  getSaboresCalzone,
  getSaboresPasta,
  getSaboresAgregado
} from '../controllers/sabores.controller.js';

const router = Router();

router.get('/', getSabores);
router.post('/', createSabor);
router.put('/:id', updateSabor);
router.delete('/:id', deleteSabor);
router.get('/pizza', getSaboresPizza);
router.get('/calzone', getSaboresCalzone);
router.get('/pasta', getSaboresPasta);
router.get('/agregado', getSaboresAgregado);


export default router;
