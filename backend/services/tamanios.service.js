import { findOneTamanio, createOneTamanio, reactivateOneTamanio, findAllTamanios } from '../repositories/tamanios.repository.js';

export const findAllTamaniosService = async () => {
    return await findAllTamanios();
};

export const createTamanioService = async (data) => {
    const requiredFields = ['nombre'];
    for (const field of requiredFields) {
        if (data[field] === undefined || data[field] === null) {
            throw { status: 400, message: `El campo '${field}' es obligatorio.` };
        }
    }

    const existing = await findOneTamanio(data);

    if (existing) {
        if (existing.estado) {
            throw { status: 409, message: 'Ya existe una tamaño activo con los mismos datos.' };
        }

        const reactivated = await reactivateOneTamanio(existing);
        return { reactivated: true, tamanio: reactivated };
    }

    const newTamanio = await createOneTamanio({...data, estado: true });

    return { created: true, tamanio: newTamanio}
};

