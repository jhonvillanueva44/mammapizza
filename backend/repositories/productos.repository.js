import { Producto } from '../models/Producto.js';

export const findAllProductos = async () => {
    return await Producto.findAll({
        order: [['id', 'ASC']]
    });
}

export const findOneProducto = async ({ nombre, categoria_id, tipo_id, inventario_id }) => {
    return await Producto.findOne({
        where: {
            nombre: nombre,
            categoria_id: categoria_id,
            tipo_id: tipo_id,
            inventario_id: inventario_id
        }
    });
};

export const createOneProducto = async (data) => {
    return await Producto.create(data);
}

export const reactivateOneProducto = async (producto) => {
    producto.estado = true;
    return await producto.save();
};
