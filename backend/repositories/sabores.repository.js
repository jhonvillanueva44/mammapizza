import { Sabor } from "../models/Sabor.js";

export const findAllSabores = async () => {
    return await Sabor.findAll({
        where: { estado: true },
        order: [['id', 'ASC']]
    });
};

export const findOneSabor = async ({ nombre }) => {
    return await Sabor.findOne({
        where: { nombre: nombre }
    });
};

export const reactivateOneSabor = async (sabor) => {
    sabor.estado = true;
    return await sabor.save();
};

export const createOneSabor = async (data) => {
    return await Sabor.create(data);
};
