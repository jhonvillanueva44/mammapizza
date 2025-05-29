import { Router } from 'express';
import { getProductos, createProducto, getProductosByPromociones, getProductosByCalzones, getProductosByPastas } from '../controllers/productos.controller.js';

const router = Router();

router.get('/', getProductos);
router.post('/', createProducto);

router.get('/promociones', getProductosByPromociones);
router.get('/calzones', getProductosByCalzones);
router.get('/pastas', getProductosByPastas);

export default router;