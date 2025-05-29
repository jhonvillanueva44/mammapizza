import { findAllTipos, findOneTipo, createOneTipo, reactivateOneTipo } from '../repositories/tipos.repository.js';

export const findAllTiposService = async () => {
    return await findAllTipos();
}

export const createTipoService = async (data) => {
    const requiredFields = ['nombre', 'abreviatura'];
    for (const field of requiredFields) {
        if (data[field] === undefined || data[field] === null) {
            throw { status: 400, message: `El campo '${field}' es obligatorio.` };
        }
    }

    const existing = await findOneTipo(data);

    if (existing) {
        if (existing.estado) {
            throw { status: 409, message: 'Ya existe un tipo activo con los mismos datos.' };
        }

        const reactivated = await reactivateOneTipo(existing);
        return { reactivated: true, tipo: reactivated };
    }

    const newTipo = await createOneTipo({ ...data, estado: true });

    return { created: true, tipo: newTipo };
}
