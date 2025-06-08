import { findOneCategoria, createOneCategoria, reactivateOneCategoria, findAllCategorias } from '../repositories/categorias.repository.js';

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

