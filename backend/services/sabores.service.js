import {
  findAllSabores,
  findOneSabor,
  createOneSabor,
  reactivateOneSabor,
  updateOneSabor,
  deactivateOneSabor,
  findSaboresPizza,
  findSaboresCalzone,
  findSaboresPasta,
  findSaboresAgregado,
  findSaboresBebida
} from '../repositories/sabores.repository.js';

export const findAllSaboresService = async () => {
  return await findAllSabores();
};

export const createSaborService = async (data) => {
  const requiredFields = ['nombre', 'tipo'];
  for (const field of requiredFields) {
    if (!data[field]) {
      throw { status: 400, message: `El campo '${field}' es obligatorio.` };
    }
  }

  // 🔽 Normalizar "especial"
  if (!('especial' in data)) {
    data.especial = null;
  }

  const existing = await findOneSabor(data);

  if (existing) {
    if (existing.estado) {
      throw { status: 409, message: 'Ya existe un sabor activo con el mismo nombre y tipo.' };
    }

    const reactivated = await reactivateOneSabor(existing);
    return { reactivated: true, sabor: reactivated };
  }

  const newSabor = await createOneSabor({ ...data, estado: true });
  return { created: true, sabor: newSabor };
};

export const updateSaborService = async (id, data) => {
  if (!data.nombre && !data.descripcion && data.especial === undefined && !data.tipo) {
    throw { status: 400, message: 'Se requiere al menos un campo para actualizar.' };
  }

  // 🔽 Normalizar "especial"
  if (!('especial' in data)) {
    data.especial = null;
  }

  const updated = await updateOneSabor(id, data);
  if (!updated) throw { status: 404, message: 'Sabor no encontrado o inactivo.' };

  return updated;
};

export const deleteSaborService = async (id) => {
  const deleted = await deactivateOneSabor(id);
  if (!deleted) throw { status: 404, message: 'Sabor no encontrado o ya está inactivo.' };

  return deleted;
};

export const findSaboresPizzaService = async () => {
  return await findSaboresPizza();
};

export const findSaboresCalzoneService = async () => {
  return await findSaboresCalzone();
};

export const findSaboresPastaService = async () => {
  return await findSaboresPasta();
};

export const findSaboresAgregadoService = async () => {
  return await findSaboresAgregado();
};

export const findSaboresBebidaService = async () => {
  return await findSaboresBebida();
};