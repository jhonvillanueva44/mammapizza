import { Router } from 'express';
import { getProductos, createProducto, getProductosByPizzas, getProductosByCalzones, updateProducto, deleteProducto } from '../controllers/productos.controller.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

router.get('/', getProductos);
router.post('/', upload.single('imagen'),createProducto);
router.put('/:id', upload.single('imagen'), updateProducto);
router.delete('/:id', deleteProducto);
router.get('/pizzas', getProductosByPizzas);
router.get('/calzones', getProductosByCalzones);

export default router;