import { Router } from 'express';
import { getSabores, createSabor } from '../controllers/sabores.controller.js';

const router = Router();

router.get('/', getSabores);
router.post('/', createSabor);

export default router;
