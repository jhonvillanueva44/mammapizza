import { Producto } from '../models/Producto.js';
import { Unico } from '../models/Unico.js';
import { TamanioSabor } from '../models/TamanioSabor.js';
import { Sabor } from '../models/Sabor.js';
import { Tamanio } from '../models/Tamanio.js';
import { Combinacion } from '../models/Combinacion.js';


export const findAllProductos = async () => {
    return await Producto.findAll({
        where: { estado: true },
        order: [['id', 'ASC']]
    });
}

export const findOneProducto = async ({ nombre, categoria_id}) => {
    return await Producto.findOne({
        where: {
            nombre: nombre,
            categoria_id: categoria_id
        }
    });
};

export const reactivateOneProducto = async (producto) => {
    producto.estado = true;
    return await producto.save();
};

export const createOneProducto = async (data) => {
    return await Producto.create(data);
}

export const createUnico = async (producto_id, tamanio_sabor_id) => {
    return await Unico.create({
        producto_id,
        tamanio_sabor_id,
        estado: true
    });
}

export const createCombinacion = async (producto_id, tamanio_sabor_id) => {
    return await Combinacion.create({
        producto_id,
        tamanio_sabor_id,
        estado: true
    });
}

export const deleteUnicosByProducto = async (producto_id) => {
    return await Unico.destroy({ where: { producto_id } });
}

export const deleteCombinacionesByProducto = async (producto_id) => {
    return await Combinacion.destroy({ where: { producto_id } });
}

export const getTamanioSaboresByIds = async (ids) => {
    return await TamanioSabor.findAll({
        where: { id: ids, estado: true }
    });
}

export const findAllProductosByCategoria = async (categoriaId) => {
    return await Producto.findAll({
        where: {
            categoria_id: categoriaId,
            estado: true
        },
        order: [['id', 'ASC']]
    });
};

export const findAllProductosUniquesNested = async (categoriaId) => {
    return await Producto.findAll({
        where: {
            categoria_id: categoriaId,
            estado: true
        },
        order: [['id', 'ASC']],
        include: [
            {
                model: Unico,
                as: 'unicos', 
                separate: true,
                order: [['id', 'ASC']],
                include: [
                    {
                        model: TamanioSabor,
                        as: 'tamanios_sabor',
                        include: [
                            {
                                model: Sabor,
                                as: 'sabor',
                                attributes: ['id', 'nombre', 'descripcion', 'especial']
                            },
                            {
                                model: Tamanio,
                                as: 'tamanio',
                                attributes: ['id', 'nombre', 'descripcion']
                            }
                        ]
                    }
                ]
            },
            {
                model: Combinacion,
                separate: true,
                order: [['id', 'ASC']],
                include: [
                    {
                        model: TamanioSabor,
                        as: 'tamanio_sabor',
                        include: [
                            {
                                model: Sabor,
                                as: 'sabor',
                                attributes: ['id', 'nombre', 'descripcion', 'especial']
                            },
                            {
                                model: Tamanio,
                                as: 'tamanio',
                                attributes: ['id', 'nombre', 'descripcion']
                            }
                        ]
                    }
                ]
            }
        ]
    });
};

export const updateOneProducto = async (id, data) => {
    const producto = await Producto.findByPk(id);
    if (!producto || !producto.estado) return null;

    await producto.update(data);
    return producto;
};

export const deactivateOneProducto = async (id) => {
    const producto = await Producto.findByPk(id);
    if (!producto || !producto.estado) return null;

    producto.estado = false;
    return await producto.save();
};
