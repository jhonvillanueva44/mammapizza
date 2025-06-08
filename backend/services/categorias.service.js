import { findOneCategoria, createOneCategoria, reactivateOneCategoria, findAllCategorias, updateOneCategoria, deactivateOneCategoria } from '../repositories/categorias.repository.js';

export const findAllCategoriasService = async () => {
    return await findAllCategorias();
};

export const createCategoriaService = async (data) => {
    const requiredFields = ['nombre'];
    for (const field of requiredFields) {
        if (data[field] === undefined || data[field] === null) {
            throw { status: 400, message: `El campo '${field}' es obligatorio.` };
        }
    }

    const existing = await findOneCategoria(data);

    if (existing) {
        if (existing.estado) {
            throw { status: 409, message: 'Ya existe una categoría activa con los mismos datos.' };
        }

        const reactivated = await reactivateOneCategoria(existing);
        return { reactivated: true, categoria: reactivated };
    }

    const newCategoria = await createOneCategoria({...data, estado: true });

    return { created: true, categoria: newCategoria}
};

export const updateCategoriaService = async (id, data) => {
    if (!data.nombre && !data.descripcion) {
        throw { status: 400, message: 'Se requiere al menos un campo para actualizar.' };
    }

    const updated = await updateOneCategoria(id, data);
    if (!updated) throw { status: 404, message: 'Categoría no encontrada o inactiva.' };

    return updated;
};

export const deleteCategoriaService = async (id) => {
    const deleted = await deactivateOneCategoria(id);
    if (!deleted) throw { status: 404, message: 'Categoría no encontrada o ya está inactiva.' };

    return deleted;
};
