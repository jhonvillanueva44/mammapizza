import { TamanioSabor } from '../models/TamanioSabor.js';

export const findAllTamaniosSabores = async () => {
  return await TamanioSabor.findAll({
    where: { estado: true },
    include: [
      { association: 'tamanio', attributes: ['id', 'nombre', 'tipo'] },
      { association: 'sabor', attributes: ['id', 'nombre', 'tipo'] }
    ],
    order: [['id', 'ASC']]
  });
};

export const findOneTamanioSabor = async ({ tamanio_id, sabor_id }) => {
  return await TamanioSabor.findOne({
    where: { tamanio_id, sabor_id }
  });
};

export const createOneTamanioSabor = async (data) => {
  return await TamanioSabor.create(data);
};

export const reactivateOneTamanioSabor = async (tamanioSabor) => {
  tamanioSabor.estado = true;
  return await tamanioSabor.save();
};

export const updateOneTamanioSabor = async (id, data) => {
  const record = await TamanioSabor.findByPk(id);
  if (!record || !record.estado) return null;

  await record.update(data);
  return record;
};

export const deactivateOneTamanioSabor = async (id) => {
  const record = await TamanioSabor.findByPk(id);
  if (!record || !record.estado) return null;

  record.estado = false;
  return await record.save();
};
