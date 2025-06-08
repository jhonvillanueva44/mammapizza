import { findAllCombinaciones, findOneCombinacion, createOneCombinacion, reactivateOneCombinacion } from '../repositories/combinaciones.repository.js';

export const findAllCombinacionesService = async () => {
  return await findAllCombinaciones();
};

export const createCombinacionService = async (data) => {
  const requiredFields = ['producto_id', 'tamanio_sabor_id'];

  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null) {
      throw { status: 400, message: `El campo '${field}' es obligatorio.` };
    }
  }

  const existing = await findOneCombinacion(data);

  if (existing) {
    if (existing.estado) {
      throw {
        status: 409,
        message: 'Ya existe una combinación activa.'
      };
    }

    const reactivated = await reactivateOneCombinacion(existing);
    return { reactivated: true, combinacion: reactivated };
  }

  const newCombinacion = await createOneCombinacion({ ...data, estado: true });
  return { created: true, combinacion: newCombinacion };
};
