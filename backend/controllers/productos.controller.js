import { findAllProductosService, createProductoService, findAllProductosByCategoriaService, findAllProductosUniquesNestedService, updateProductoService, deleteProductoService } from '../services/productos.service.js';

export const getProductos = async (req, res) => {
    try {
        const productos = await findAllProductosService();

        const fullUrl = `${req.protocol}://${req.get('host')}`;

        const productosConImagenAbsoluta = productos.map(producto => ({
            ...producto.toJSON(),
            imagen: producto.imagen
                ? `${fullUrl}${producto.imagen}`
                : `${fullUrl}/uploads/default.jpeg`
        }));

        res.json(productosConImagenAbsoluta);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
};

export const createProducto = async (req, res) => {
    try {
        const data = req.body;
        const file = req.file;

        const sanitize = (value) => {
            if (value === '' || value === undefined || value === null) return null;
            return isNaN(value) ? value : Number(value);
        };

        let imagePath = file ? `/uploads/${file.filename}` : '/uploads/default.jpeg';

        const productoData = {
            nombre: data.nombre,
            precio: sanitize(data.precio), // Será reemplazado en el servicio
            stock: sanitize(data.stock),
            categoria_id: sanitize(data.categoria_id),
            descripcion: data.descripcion || null,
            impuesto: sanitize(data.impuesto),
            descuento: sanitize(data.descuento),
            destacado: data.destacado === 'true',
            habilitado: data.habilitado === 'true',
            unico_sabor: data.unico_sabor === 'true',
            imagen: imagePath,
            tamanio_sabor_ids: data.tamanio_sabor_ids // Se pasa como string JSON
        };

        const result = await createProductoService(productoData);

        if (result.reactivated) {
            return res.status(200).json({
                message: 'Producto reactivado exitosamente.',
                producto: result.producto
            });
        }

        res.status(201).json({
            message: 'Producto creado exitosamente.',
            producto: result.producto
        });

    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ 
            error: error.message || 'Error interno del servidor' 
        });
    }
};

export const updateProducto = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;
        const file = req.file;

        const sanitize = (value) => {
            if (value === '' || value === undefined || value === null) return null;
            return isNaN(value) ? value : Number(value);
        };

        const productoData = {
            nombre: data.nombre,
            precio: sanitize(data.precio), // Será reemplazado en el servicio
            stock: sanitize(data.stock),
            categoria_id: sanitize(data.categoria_id),
            descripcion: data.descripcion || null,
            impuesto: sanitize(data.impuesto),
            descuento: sanitize(data.descuento),
            destacado: data.destacado === 'true',
            habilitado: data.habilitado === 'true',
            unico_sabor: data.unico_sabor === 'true',
            tamanio_sabor_ids: data.tamanio_sabor_ids
        };

        if (file) {
            productoData.imagen = `/uploads/${file.filename}`;
        }

        const updated = await updateProductoService(id, productoData);
        res.status(200).json({ 
            message: 'Producto actualizado exitosamente.', 
            producto: updated 
        });

    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ 
            error: error.message || 'Error al actualizar el producto.' 
        });
    }
};

export const getProductosByPizzas = async (req, res) => {
    const categoriaId = 1;

    try {
        const productos = await findAllProductosUniquesNestedService(categoriaId);

        const fullUrl = `${req.protocol}://${req.get('host')}`;
        const productosConImagenAbsoluta = productos.map(producto => ({
            ...producto.toJSON(),
            imagen: producto.imagen
                ? `${fullUrl}${producto.imagen}`
                : `${fullUrl}/uploads/default.jpeg`
        }));

        res.json(productosConImagenAbsoluta);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || 'Error al obtener los productos por categoría' });
    }
};

export const getProductosByCalzones = async (req, res) => {
    const categoriaId = 2;

    try {
        const productos = await findAllProductosUniquesNestedService(categoriaId);

        const fullUrl = `${req.protocol}://${req.get('host')}`;
        const productosConImagenAbsoluta = productos.map(producto => ({
            ...producto.toJSON(),
            imagen: producto.imagen
                ? `${fullUrl}${producto.imagen}`
                : `${fullUrl}/uploads/default.jpeg`
        }));

        res.json(productosConImagenAbsoluta);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || 'Error al obtener los productos por categoría' });
    }
};

export const deleteProducto = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const deleted = await deleteProductoService(id);
        res.status(200).json({ message: 'Producto desactivado.', producto: deleted });
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || 'Error al desactivar el producto.' });
    }
};



/*
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
*/
