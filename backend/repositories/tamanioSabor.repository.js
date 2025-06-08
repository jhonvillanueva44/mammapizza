import { TamanioSabor } from '../models/TamanioSabor.js';

export const findAllTamaniosSabores = async () => {
  return await TamanioSabor.findAll({
    where: { estado: true },
    order: [['id', 'ASC']]
  });
};

export const findOneTamanioSabor = async ({ tamanio_id, sabor_id }) => {
  return await TamanioSabor.findOne({
    where: {
        tamanio_id: tamanio_id,
        sabor_id: sabor_id
    }
  });
};

export const reactivateOneTamanioSabor = async (tamanioSabor) => {
  tamanioSabor.estado = true;
  return await tamanioSabor.save();
};

export const createOneTamanioSabor = async (data) => {
  return await TamanioSabor.create(data);
};
