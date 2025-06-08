import { findAllSabores, findOneSabor, createOneSabor, reactivateOneSabor } from '../repositories/sabores.repository.js';

export const findAllSaboresService = async () => {
    return await findAllSabores();
};

export const createSaborService = async (data) => {
    const requiredFields = ['nombre'];
    for (const field of requiredFields) {
        if (data[field] === undefined || data[field] === null) {
            throw { status: 400, message: `El campo '${field}' es obligatorio.` };
        }
    }

    const existing = await findOneSabor(data);

    if (existing) {
        if (existing.estado) {
            throw { status: 409, message: 'Ya existe un sabor activo con los mismos datos.' };
        }

        const reactivated = await reactivateOneSabor(existing);
        return { reactivated: true, sabor: reactivated };
    }

    const newSabor = await createOneSabor({ ...data, estado: true });
    return { created: true, sabor: newSabor };
};
