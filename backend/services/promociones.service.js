import {
    findAllPromociones,
    findOnePromocion,
    findPromocionByName,
    createOnePromocion,
    reactivateOnePromocion,
    updateOnePromocion,
    deactivateOnePromocion,
    createDetallePromocion,
    deleteDetallesByPromocion
} from '../repositories/promociones.repository.js';

export const findAllPromocionesService = async () => {
    return await findAllPromociones();
}

export const findOnePromocionService = async (id) => {
    const promocion = await findOnePromocion(id);
    if (!promocion) {
        throw { status: 404, message: 'Promoción no encontrada o inactiva.' };
    }
    return promocion;
}

export const createPromocionService = async (data) => {
    const requiredFields = ['nombre', 'productos'];
    for (const field of requiredFields) {
        if (data[field] === undefined || data[field] === null) {
            throw { status: 400, message: `El campo '${field}' es obligatorio.` };
        }
    }

    // Validar que productos sea un array
    if (!Array.isArray(data.productos)) {
        throw { status: 400, message: 'El campo productos debe ser un array' };
    }

    if (data.productos.length === 0) {
        throw { status: 400, message: 'Debe proporcionar al menos un producto para la promoción.' };
    }

    const existing = await findPromocionByName(data.nombre);

    if (existing) {
        if (existing.estado) {
            throw { status: 409, message: 'Ya existe una promoción activa con el mismo nombre.' };
        }
        const reactivated = await reactivateOnePromocion(existing);
        return { reactivated: true, promocion: reactivated };
    }

    const newPromocion = await createOnePromocion({ 
        nombre: data.nombre,
        precio: data.precio || 0,
        stock: data.stock || 0,
        imagen: data.imagen,
        descripcion: data.descripcion,
        impuesto: data.impuesto,
        descuento: data.descuento,
        destacado: data.destacado,
        habilitado: data.habilitado,
        estado: true
    });

    // Crear detalles de promoción
    for (const producto of data.productos) {
        await createDetallePromocion(
            newPromocion.id,
            producto.producto_id,
            producto.cantidad || 1
        );
    }

    return { created: true, promocion: newPromocion };
};

export const updatePromocionService = async (id, data) => {
    const requiredFields = ['nombre', 'productos'];
    for (const field of requiredFields) {
        if (data[field] === undefined || data[field] === null) {
            throw { status: 400, message: `El campo '${field}' es obligatorio.` };
        }
    }

    // Validar que productos sea un array
    if (!Array.isArray(data.productos)) {
        throw { status: 400, message: 'El campo productos debe ser un array' };
    }

    if (data.productos.length === 0) {
        throw { status: 400, message: 'Debe proporcionar al menos un producto para la promoción.' };
    }

    const existingByName = await findPromocionByName(data.nombre);
    if (existingByName && existingByName.id !== id && existingByName.estado) {
        throw { status: 409, message: 'Ya existe una promoción activa con el mismo nombre.' };
    }

    const updated = await updateOnePromocion(id, {
        nombre: data.nombre,
        precio: data.precio,
        stock: data.stock,
        imagen: data.imagen,
        descripcion: data.descripcion,
        impuesto: data.impuesto,
        descuento: data.descuento,
        destacado: data.destacado,
        habilitado: data.habilitado
    });

    if (!updated) {
        throw { status: 404, message: 'Promoción no encontrada o inactiva.' };
    }

    // Eliminar detalles existentes y crear nuevos
    await deleteDetallesByPromocion(id);
    for (const producto of data.productos) {
        await createDetallePromocion(
            id,
            producto.producto_id,
            producto.cantidad || 1
        );
    }

    return updated;
};

export const deletePromocionService = async (id) => {
    const deleted = await deactivateOnePromocion(id);
    if (!deleted) {
        throw { status: 404, message: 'Promoción no encontrada o ya inactiva.' };
    }
    return deleted;
};