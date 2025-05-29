import { Router } from 'express';
import { getCategorias, createCategoria } from '../controllers/categorias.controller.js';

const router = Router();

router.get('/', getCategorias);
router.post('/', createCategoria);
//router.put('/categorias/:id');
//router.delete('/categorias/:id');
//router.get('/categorias/:id');

export default router;
