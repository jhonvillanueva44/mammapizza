import { Categoria } from "../models/Categoria.js";

export const findAllCategorias = async () => {
    return await Categoria.findAll({
        order: [['id', 'ASC']]
    });
};

export const findOneCategoria = async ({ nombre, abreviatura, nivel }) => {
    return await Categoria.findOne({
        where: {
            nombre: nombre,
            abreviatura: abreviatura,
            nivel: nivel
        }
    });
};

export const createOneCategoria = async (data) => {
    return await Categoria.create(data);
};

export const reactivateOneCategoria = async (categoria) => {
    categoria.estado = true;
    return await categoria.save();
};

