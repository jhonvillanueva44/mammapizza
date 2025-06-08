import { Router } from 'express';
import { getDetallesPromocion, createDetallePromocion } from '../controllers/detallesPromocion.controller.js';

const router = Router();

router.get('/', getDetallesPromocion);
router.post('/', createDetallePromocion);

export default router;
