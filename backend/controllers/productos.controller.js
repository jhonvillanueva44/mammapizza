import { findAllProductosService, createProductoService } from '../services/productos.service.js';

export const getProductos = async (req, res) => {
    try {
        const productos = await findAllProductosService();
        res.json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
}

export const createProducto = async (req, res) => {
    try {
        const result = await createProductoService(req.body);

        if (result.reactivated) {
            return res.status(200).json({
                message: 'Producto reactivado.',
                producto: result.producto
            });
        }

        res.status(201).json({
            message: 'Producto creado.',
            producto: result.producto
        });
        
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || 'Error interno del servidor' });
    }
}

