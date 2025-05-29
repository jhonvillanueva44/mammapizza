import { findAllProductosService, createProductoService, findAllProductosByCategoriaService } from '../services/productos.service.js';

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

export const getProductosByPromociones = async (req, res) => {
    const categoriaId = 1;

    try {
        const productos = await findAllProductosByCategoriaService(categoriaId);
        res.json(productos);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || 'Error al obtener los productos por categoría' });
    }
};

export const getProductosByCalzones = async (req, res) => {
    const categoriaId = 8;

    try {
        const productos = await findAllProductosByCategoriaService(categoriaId);
        res.json(productos);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || 'Error al obtener los productos por categoría' });
    }
}

export const getProductosByPastas = async (req, res) => {
    const categoriaId = 9;

    try {
        const productos = await findAllProductosByCategoriaService(categoriaId);
        res.json(productos);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || 'Error al obtener los productos por categoría' });
    }
}

