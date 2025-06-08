import { Router } from 'express';
import { getUnicos, createUnico } from '../controllers/unicos.controller.js';

const router = Router();

router.get('/', getUnicos);
router.post('/', createUnico);

export default router;
