import { findAllUnicos, findOneUnico, createOneUnico, reactivateOneUnico } from '../repositories/unicos.repository.js';

export const findAllUnicosService = async () => {
  return await findAllUnicos();
};

export const createUnicoService = async (data) => {
  const requiredFields = ['producto_id', 'tamanio_sabor_id',];

  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null) {
      throw { status: 400, message: `El campo '${field}' es obligatorio.` };
    }
  }

  const existing = await findOneUnico(data);

  if (existing) {
    if (existing.estado) {
      throw {
        status: 409,
        message: 'Ya existe un producto de sabor unico activo.'
      };
    }

    const reactivated = await reactivateOneUnico(existing);
    return { reactivated: true, unico: reactivated };
  }

  const newUnico = await createOneUnico({ ...data, estado: true });
  return { created: true, unico: newUnico };
};
