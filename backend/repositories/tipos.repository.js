import { Tipo } from '../models/Tipo.js'

export const findAllTipos = async () => {
    return await Tipo.findAll({
        order: [['id', 'ASC']]
    });
};

export const findOneTipo = async ({ nombre, abreviatura }) => {
    return await Tipo.findOne({
        where: {
            nombre: nombre,
            abreviatura: abreviatura
        }
    });
};

export const createOneTipo = async (data) => {
    return await Tipo.create(data);
};

export const reactivateOneTipo = async (tipo) => {
    tipo.estado = true;
    return await tipo.save();
}
