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

