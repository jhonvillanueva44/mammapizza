import { Router } from 'express';
import { getPromociones, createPromocion } from '../controllers/promociones.controller.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

router.get('/', getPromociones);
router.post('/', upload.single('imagen'), createPromocion);

export default router;