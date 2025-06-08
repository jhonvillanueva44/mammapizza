import { Tamanio } from "../models/Tamanio.js";

export const findAllTamanios = async () => {
    return await Tamanio.findAll({
        where: { estado: true },
        order: [['id', 'ASC']]
    });
};

export const findOneTamanio = async ({ nombre }) => {
    return await Tamanio.findOne({
        where: {
            nombre: nombre
        }
    });
};

export const reactivateOneTamanio = async (tamanio) => {
    tamanio.estado = true;
    return await tamanio.save();
};

export const createOneTamanio = async (data) => {
    return await Tamanio.create(data);
};

