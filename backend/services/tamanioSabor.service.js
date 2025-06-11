import {
  findAllTamaniosSabores,
  findOneTamanioSabor,
  createOneTamanioSabor,
  reactivateOneTamanioSabor,
  updateOneTamanioSabor,
  deactivateOneTamanioSabor
} from '../repositories/tamanioSabor.repository.js';

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

  const newTamanioSabor = await createOneTamanioSabor({ ...data, estado: true });
  return { created: true, tamanioSabor: newTamanioSabor };
};

export const updateTamanioSaborService = async (id, data) => {
  if (data.precio === undefined && data.precio === null) {
    throw { status: 400, message: 'Se requiere al menos el campo precio para actualizar.' };
  }

  const updated = await updateOneTamanioSabor(id, data);
  if (!updated) throw { status: 404, message: 'Tamaño-sabor no encontrado o inactivo.' };

  return updated;
};

export const deleteTamanioSaborService = async (id) => {
  const deleted = await deactivateOneTamanioSabor(id);
  if (!deleted) throw { status: 404, message: 'Tamaño-sabor no encontrado o ya está inactivo.' };

  return deleted;
};
