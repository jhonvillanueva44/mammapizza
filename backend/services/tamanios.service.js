import {
  findAllTamanios,
  findOneTamanio,
  createOneTamanio,
  reactivateOneTamanio,
  updateOneTamanio,
  deactivateOneTamanio,
  findTamaniosPizza,
  findTamaniosCalzone,
  findTamaniosPasta,
  findTamaniosAgregado,
  findTamaniosBebida
} from '../repositories/tamanios.repository.js';

export const findAllTamaniosService = async () => {
  return await findAllTamanios();
};

export const createTamanioService = async (data) => {
  const requiredFields = ['nombre', 'tipo'];
  for (const field of requiredFields) {
    if (!data[field]) {
      throw { status: 400, message: `El campo '${field}' es obligatorio.` };
    }
  }

  const existing = await findOneTamanio(data);

  if (existing) {
    if (existing.estado) {
      throw { status: 409, message: 'Ya existe un tamaño activo con el mismo nombre y tipo.' };
    }

    const reactivated = await reactivateOneTamanio(existing);
    return { reactivated: true, tamanio: reactivated };
  }

  const newTamanio = await createOneTamanio({ ...data, estado: true });
  return { created: true, tamanio: newTamanio };
};

export const updateTamanioService = async (id, data) => {
  if (!data.nombre && !data.descripcion && !data.tipo) {
    throw { status: 400, message: 'Se requiere al menos un campo para actualizar.' };
  }

  const updated = await updateOneTamanio(id, data);
  if (!updated) throw { status: 404, message: 'Tamaño no encontrado o inactivo.' };

  return updated;
};

export const deleteTamanioService = async (id) => {
  const deleted = await deactivateOneTamanio(id);
  if (!deleted) throw { status: 404, message: 'Tamaño no encontrado o ya está inactivo.' };

  return deleted;
};

export const findTamaniosPizzaService = async () => {
  return await findTamaniosPizza();
};

export const findTamaniosCalzoneService = async () => {
  return await findTamaniosCalzone();
};

export const findTamaniosPastaService = async () => {
  return await findTamaniosPasta();
};

export const findTamaniosAgregadoService = async () => {
  return await findTamaniosAgregado();
};

export const findTamaniosBebidaService = async () => {
  return await findTamaniosBebida();
};