import { Unico } from '../models/Unico.js';

export const findAllUnicos = async () => {
  return await Unico.findAll({
    where: { estado: true },
    order: [['id', 'ASC']]
  });
};

export const findOneUnico = async ({ producto_id, tamanio_sabor_id }) => {
  return await Unico.findOne({
    where: {
        producto_id: producto_id,
        tamanio_sabor_id: tamanio_sabor_id
    }
  });
};

export const reactivateOneUnico = async (unico) => {
  unico.estado = true;
  return await unico.save();
};

export const createOneUnico = async (data) => {
  return await Unico.create(data);
};
