import { Combinacion } from '../models/Combinacion.js';

export const findAllCombinaciones = async () => {
  return await Combinacion.findAll({
    where: { estado: true },
    order: [['id', 'ASC']]
  });
};

export const findOneCombinacion = async ({ producto_id, tamanio_sabor_id }) => {
  return await Combinacion.findOne({
    where: {
      producto_id,
      tamanio_sabor_id
    }
  });
};

export const reactivateOneCombinacion = async (combinacion) => {
  combinacion.estado = true;
  return await combinacion.save();
};

export const createOneCombinacion = async (data) => {
  return await Combinacion.create(data);
};
