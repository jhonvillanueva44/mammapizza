import { Categoria } from "../models/Categoria.js";

export const findAllCategorias = async () => {
    return await Categoria.findAll({
        where: { estado: true },
        order: [['id', 'ASC']]
    });
};

export const findOneCategoria = async ({ nombre }) => {
    return await Categoria.findOne({
        where: {
            nombre: nombre
        }
    });
};

export const reactivateOneCategoria = async (categoria) => {
    categoria.estado = true;
    return await categoria.save();
};

export const createOneCategoria = async (data) => {
    return await Categoria.create(data);
};

export const updateOneCategoria = async (id, data) => {
    const categoria = await Categoria.findByPk(id);
    if (!categoria || !categoria.estado) return null;

    if (data.nombre && data.nombre !== categoria.nombre) {
        const existing = await Categoria.findOne({ where: { nombre: data.nombre, estado: true } });
        if (existing) throw { status: 409, message: 'Ya existe otra categoría activa con ese nombre.' };
    }

    await categoria.update(data);
    return categoria;
};

export const deactivateOneCategoria = async (id) => {
    const categoria = await Categoria.findByPk(id);
    if (!categoria || !categoria.estado) return null;

    categoria.estado = false;
    return await categoria.save();
};

