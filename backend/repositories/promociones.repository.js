import { Promocion } from '../models/Promocion.js';
import { DetallePromocion } from '../models/DetallePromocion.js';
import { Producto } from '../models/Producto.js';

export const findAllPromociones = async () => {
    return await Promocion.findAll({
        where: { estado: true },
        order: [['id', 'ASC']],
        include: [
            {
                model: DetallePromocion,
                as: 'detalles_promocion',
                include: [
                    {
                        model: Producto,
                        as: 'producto'
                    }
                ]
            }
        ]
    });
}

export const findOnePromocion = async (id) => {
    return await Promocion.findOne({
        where: { id, estado: true },
        include: [
            {
                model: DetallePromocion,
                as: 'detalles_promocion',
                include: [
                    {
                        model: Producto,
                        as: 'producto'
                    }
                ]
            }
        ]
    });
};

export const findPromocionByName = async (nombre) => {
    return await Promocion.findOne({
        where: { nombre }
    });
};

export const reactivateOnePromocion = async (promocion) => {
    promocion.estado = true;
    return await promocion.save();
};

export const createOnePromocion = async (data) => {
    return await Promocion.create(data);
}

export const createDetallePromocion = async (promocion_id, producto_id, cantidad) => {
    return await DetallePromocion.create({
        promocion_id,
        producto_id,
        cantidad,
        estado: true
    });
}

export const deleteDetallesByPromocion = async (promocion_id) => {
    return await DetallePromocion.destroy({ where: { promocion_id } });
}

export const updateOnePromocion = async (id, data) => {
    const promocion = await Promocion.findByPk(id);
    if (!promocion || !promocion.estado) return null;

    await promocion.update(data);
    return promocion;
};

export const deactivateOnePromocion = async (id) => {
    const promocion = await Promocion.findByPk(id);
    if (!promocion || !promocion.estado) return null;

    promocion.estado = false;
    return await promocion.save();
};