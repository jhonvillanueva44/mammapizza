import { Router } from 'express';
import { getProductos, createProducto, getProductosByPizzas, getProductosByCalzones, updateProducto, deleteProducto, getPizzaById, getCalzoneById,
    getPastaById, getProductosByPastas  } from '../controllers/productos.controller.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

router.get('/', getProductos);
router.post('/', upload.single('imagen'),createProducto);
router.put('/:id', upload.single('imagen'), updateProducto);
router.delete('/:id', deleteProducto);

// Pizzas
router.get('/pizzas', getProductosByPizzas);
router.get('/pizzas/:id', getPizzaById);

// Calzones
router.get('/calzones', getProductosByCalzones);
router.get('/calzones/:id', getCalzoneById);

// Pastas
router.get('/pastas', getProductosByPastas);
router.get('/pastas/:id', getPastaById);

export default router;