import { Tamanio } from "../models/Tamanio.js";

export const findAllTamanios = async () => {
  return await Tamanio.findAll({
    where: { estado: true },
    order: [['id', 'ASC']]
  });
};

export const findOneTamanio = async ({ nombre, tipo }) => {
  return await Tamanio.findOne({
    where: { nombre, tipo }
  });
};

export const reactivateOneTamanio = async (tamanio) => {
  tamanio.estado = true;
  return await tamanio.save();
};

export const createOneTamanio = async (data) => {
  return await Tamanio.create(data);
};

export const updateOneTamanio = async (id, data) => {
  const tamanio = await Tamanio.findByPk(id);
  if (!tamanio || !tamanio.estado) return null;

  const newNombre = data.nombre ?? tamanio.nombre;
  const newTipo = data.tipo ?? tamanio.tipo;

  if (newNombre !== tamanio.nombre || newTipo !== tamanio.tipo) {
    const existing = await findOneTamanio({ nombre: newNombre, tipo: newTipo });
    if (existing && existing.id !== tamanio.id && existing.estado) {
      throw { status: 409, message: 'Ya existe otro tamaño activo con el mismo nombre y tipo.' };
    }
  }

  await tamanio.update(data);
  return tamanio;
};

export const deactivateOneTamanio = async (id) => {
  const tamanio = await Tamanio.findByPk(id);
  if (!tamanio || !tamanio.estado) return null;

  tamanio.estado = false;
  return await tamanio.save();
};

export const findTamaniosPizza = async () => {
  return await Tamanio.findAll({
    where: { estado: true, tipo: 'Pizza' },
    order: [['id', 'ASC']]
  });
};

export const findTamaniosCalzone = async () => {
  return await Tamanio.findAll({
    where: { estado: true, tipo: 'Calzone' },
    order: [['id', 'ASC']]
  });
};

export const findTamaniosPasta = async () => {
  return await Tamanio.findAll({
    where: { estado: true, tipo: 'Pasta' },
    order: [['id', 'ASC']]
  });
};

export const findTamaniosAgregado = async () => {
  return await Tamanio.findAll({
    where: { estado: true, tipo: 'Agregado' },
    order: [['id', 'ASC']]
  });
};

export const findTamaniosBebida = async () => {
  return await Tamanio.findAll({
    where: { estado: true, tipo: 'Bebida' },
    order: [['id', 'ASC']]
  });
};
