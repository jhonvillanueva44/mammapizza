import { Usuario } from "../models/Usuario.js";

export const findAllUsuarios = async () => {
    return await Usuario.findAll({
        order: [['id', 'ASC']]
    });
};

export const findOneUsuario = async (id) => {
    return await Usuario.findByPk(id);
};