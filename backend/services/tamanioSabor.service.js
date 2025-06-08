import { findAllTamaniosSabores, findOneTamanioSabor, createOneTamanioSabor, reactivateOneTamanioSabor } from '../repositories/tamanioSabor.repository.js';

export const findAllTamaniosSaboresService = async () => {
  return await findAllTamaniosSabores();
};

export const createTamanioSaborService = async (data) => {
  const requiredFields = ['tamanio_id', 'sabor_id', 'precio'];

  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null) {
      throw { status: 400, message: `El campo '${field}' es obligatorio.` };
    }
  }

  const existing = await findOneTamanioSabor(data);

  if (existing) {
    if (existing.estado) {
      throw {
        status: 409,
        message: 'Ya existe un tamaño-sabor activo con ese tamaño y sabor.'
      };
    }

    const reactivated = await reactivateOneTamanioSabor(existing);
    return { reactivated: true, tamanioSabor: reactivated };
  }

  const newTamnioSabor = await createOneTamanioSabor({ ...data, estado: true });
  return { created: true, tamanioSabor: newTamnioSabor };
};
