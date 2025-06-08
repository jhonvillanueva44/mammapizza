import { Router } from 'express';
import {
  getSabores,
  createSabor,
  updateSabor,
  deleteSabor
} from '../controllers/sabores.controller.js';

const router = Router();

router.get('/', getSabores);
router.post('/', createSabor);
router.put('/:id', updateSabor);
router.delete('/:id', deleteSabor);

export default router;
