import { findAllProductos, findOneProducto, createOneProducto, reactivateOneProducto, findAllProductosByCategoria, findAllProductosUniquesNested, updateOneProducto, deactivateOneProducto, createUnico,
    createCombinacion,
    deleteUnicosByProducto,
    deleteCombinacionesByProducto,
    getTamanioSaboresByIds } from '../repositories/productos.repository.js';

export const findAllProductosService = async () => {
    return await findAllProductos();
}

const validateAndProcessTamanioSabores = async (unico_sabor, tamanioSaborIds) => {
    if (unico_sabor && tamanioSaborIds.length !== 1) {
        throw { status: 400, message: 'Debe proporcionar exactamente un tamanio_sabor_id cuando unico_sabor es true' };
    }

    if (!unico_sabor && tamanioSaborIds.length !== 2) {
        throw { status: 400, message: 'Debe proporcionar exactamente dos tamanio_sabor_ids cuando unico_sabor es false' };
    }

    const tamanioSabores = await getTamanioSaboresByIds(tamanioSaborIds);
    if (tamanioSabores.length !== tamanioSaborIds.length) {
        throw { status: 404, message: 'Uno o más tamanio_sabor_ids no existen o están inactivos' };
    }

    return tamanioSabores;
}

const calculatePrice = (unico_sabor, tamanioSabores) => {
    return unico_sabor 
        ? tamanioSabores[0].precio 
        : Math.max(tamanioSabores[0].precio, tamanioSabores[1].precio);
}

const createProductRelations = async (producto_id, unico_sabor, tamanioSaborIds) => {
    if (unico_sabor) {
        await createUnico(producto_id, tamanioSaborIds[0]);
    } else {
        await Promise.all(tamanioSaborIds.map(id => 
            createCombinacion(producto_id, id)
        ));
    }
}

export const createProductoService = async (data) => {
    const requiredFields = ['nombre', 'categoria_id', 'unico_sabor'];
    for (const field of requiredFields) {
        if (data[field] === undefined || data[field] === null) {
            throw { status: 400, message: `El campo '${field}' es obligatorio.` };
        }
    }

    // Parsear los IDs de tamaños-sabores
    let tamanioSaborIds = [];
    try {
        tamanioSaborIds = JSON.parse(data.tamanio_sabor_ids || '[]');
    } catch (e) {
        throw { status: 400, message: 'Formato inválido para tamanio_sabor_ids. Debe ser un array JSON.' };
    }

    // Validar y obtener los tamaños-sabores
    const tamanioSabores = await validateAndProcessTamanioSabores(data.unico_sabor, tamanioSaborIds);
    
    // Calcular el precio
    data.precio = calculatePrice(data.unico_sabor, tamanioSabores);
    
    // Verificar si el producto ya existe
    const existing = await findOneProducto({
        nombre: data.nombre,
        categoria_id: data.categoria_id
    });

    if (existing) {
        if (existing.estado) {
            throw { status: 409, message: 'Ya existe un producto activo con los mismos datos.' };
        }
        const reactivated = await reactivateOneProducto(existing);
        return { reactivated: true, producto: reactivated };
    }

    // Crear el producto
    const newProducto = await createOneProducto({ ...data, estado: true });

    // Crear las relaciones
    await createProductRelations(newProducto.id, data.unico_sabor, tamanioSaborIds);

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

export const findAllProductosUniquesNestedService = async (categoriaId) => {
    if (!categoriaId) {
        throw { status: 400, message: 'El campo "categoria_id" es obligatorio.' };
    }

    const productos = await findAllProductosUniquesNested(categoriaId);

    if (!productos || productos.length === 0) {
        throw { status: 404, message: 'No se encontraron productos con relaciones anidadas para la categoría especificada.' };
    }

    return productos;
};

export const updateProductoService = async (id, data) => {
    const requiredFields = ['nombre', 'categoria_id', 'unico_sabor'];
    for (const field of requiredFields) {
        if (data[field] === undefined || data[field] === null) {
            throw { status: 400, message: `El campo '${field}' es obligatorio.` };
        }
    }

    // Parsear los IDs de tamaños-sabores
    let tamanioSaborIds = [];
    try {
        tamanioSaborIds = JSON.parse(data.tamanio_sabor_ids || '[]');
    } catch (e) {
        throw { status: 400, message: 'Formato inválido para tamanio_sabor_ids. Debe ser un array JSON.' };
    }

    // Validar y obtener los tamaños-sabores
    const tamanioSabores = await validateAndProcessTamanioSabores(data.unico_sabor, tamanioSaborIds);
    
    // Calcular el precio
    data.precio = calculatePrice(data.unico_sabor, tamanioSabores);

    // Verificar conflicto con otros productos
    const existing = await findOneProducto({ 
        nombre: data.nombre, 
        categoria_id: data.categoria_id 
    });
    
    if (existing && existing.id !== id && existing.estado) {
        throw { status: 409, message: 'Ya existe un producto activo con el mismo nombre y categoría.' };
    }

    // Actualizar el producto
    const updated = await updateOneProducto(id, data);
    if (!updated) {
        throw { status: 404, message: 'Producto no encontrado o inactivo.' };
    }

    // Eliminar relaciones antiguas y crear nuevas
    if (data.unico_sabor) {
        await deleteCombinacionesByProducto(id);
        await deleteUnicosByProducto(id);
        await createUnico(id, tamanioSaborIds[0]);
    } else {
        await deleteUnicosByProducto(id);
        await deleteCombinacionesByProducto(id);
        await Promise.all(tamanioSaborIds.map(tamanioSaborId => 
            createCombinacion(id, tamanioSaborId)
        ));
    }

    return updated;
};


export const deleteProductoService = async (id) => {
    const deleted = await deactivateOneProducto(id);
    if (!deleted) {
        throw { status: 404, message: 'Producto no encontrado o ya inactivo.' };
    }
    return deleted;
};
