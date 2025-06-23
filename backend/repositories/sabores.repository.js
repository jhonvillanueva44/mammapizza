import { Sabor } from "../models/Sabor.js";

export const findAllSabores = async () => {
  return await Sabor.findAll({
    where: { estado: true },
    order: [['id', 'ASC']]
  });
};

export const findOneSabor = async ({ nombre, tipo }) => {
  return await Sabor.findOne({
    where: { nombre, tipo }
  });
};

export const reactivateOneSabor = async (sabor) => {
  sabor.estado = true;
  return await sabor.save();
};

export const createOneSabor = async (data) => {
  return await Sabor.create(data);
};

export const updateOneSabor = async (id, data) => {
  const sabor = await Sabor.findByPk(id);
  if (!sabor || !sabor.estado) return null;

  const newNombre = data.nombre ?? sabor.nombre;
  const newTipo = data.tipo ?? sabor.tipo;

  if (newNombre !== sabor.nombre || newTipo !== sabor.tipo) {
    const existing = await findOneSabor({ nombre: newNombre, tipo: newTipo });
    if (existing && existing.id !== sabor.id && existing.estado) {
      throw { status: 409, message: 'Ya existe otro sabor activo con el mismo nombre y tipo.' };
    }
  }

  await sabor.update(data);
  return sabor;
};

export const deactivateOneSabor = async (id) => {
  const sabor = await Sabor.findByPk(id);
  if (!sabor || !sabor.estado) return null;

  sabor.estado = false;
  return await sabor.save();
};

export const findSaboresPizza = async () => {
  return await Sabor.findAll({
    where: { estado: true, tipo: 'Pizza' },
    order: [['id', 'ASC']]
  });
};

export const findSaboresCalzone = async () => {
  return await Sabor.findAll({
    where: { estado: true, tipo: 'Calzone' },
    order: [['id', 'ASC']]
  });
};

export const findSaboresPasta = async () => {
  return await Sabor.findAll({
    where: { estado: true, tipo: 'Pasta' },
    order: [['id', 'ASC']]
  });
};

export const findSaboresAgregado = async () => {
  return await Sabor.findAll({
    where: { estado: true, tipo: 'Agregado' },
    order: [['id', 'ASC']]
  });
};

export const findSaboresBebida = async () => {
  return await Sabor.findAll({
    where: { estado: true, tipo: 'Bebida' },
    order: [['id', 'ASC']]
  });
};