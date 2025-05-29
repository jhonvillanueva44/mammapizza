import { Inventario } from '../models/Inventario.js'

export const findAllInventarios = async () => {
    return await Inventario.findAll({
        order: [['id', 'ASC']]
    });
};

export const findOneInventario = async ({ nombre, abreviatura }) => {
    return await Inventario.findOne({
        where: {
            nombre: nombre,
            abreviatura: abreviatura
        }
    });
}

export const createOneInventario = async (data) => {
    return await Inventario.create(data);
}

export const reactivateOneInventario = async (inventario) => {
    inventario.estado = true;
    return await inventario.save();
}

