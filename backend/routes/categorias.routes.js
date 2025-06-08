import { Router } from 'express';
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from '../controllers/categorias.controller.js';

const router = Router();

router.get('/', getCategorias);
router.post('/', createCategoria);
router.put('/:id', updateCategoria);
router.delete('/:id', deleteCategoria);

export default router;
