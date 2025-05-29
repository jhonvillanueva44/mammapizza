import { findAllProductos, findOneProducto, createOneProducto, reactivateOneProducto, findAllProductosByCategoria } from '../repositories/productos.repository.js';

export const findAllProductosService = async () => {
    return await findAllProductos();
}

export const createProductoService = async (data) => {
    const requiredFields = ['nombre', 'categoria_id', 'tipo_id', 'inventario_id'];
    for (const field of requiredFields) {
        if (data[field] === undefined || data[field] === null) {
            throw { status: 400, message: `El campo '${field}' es obligatorio.` };
        }
    }

    const existing = await findOneProducto(data);

    if (existing) {
        if (existing.estado) {
            throw { status: 409, message: 'Ya existe un producto activo con los mismos datos.' };
        }

        const reactivated = await reactivateOneProducto(existing);
        return { reactivated: true, producto: reactivated };
    }

    const newProducto = await createOneProducto({ ...data, estado: true });

    return { created: true, producto: newProducto };
};

export const findAllProductosByCategoriaService = async (categoriaId) => {
    if (!categoriaId) {
        throw { status: 400, message: 'El campo "categoria_id" es obligatorio.' };
    }

    const productos = await findAllProductosByCategoria(categoriaId);

    if (productos.length === 0) {
        throw { status: 404, message: 'No se encontraron productos para la categoría especificada.' };
    }

    return productos;
};

