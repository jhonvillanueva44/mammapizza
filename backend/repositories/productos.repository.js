import { Producto } from '../models/Producto.js';
import { Unico } from '../models/Unico.js';
import { TamanioSabor } from '../models/TamanioSabor.js';
import { Sabor } from '../models/Sabor.js';
import { Tamanio } from '../models/Tamanio.js';

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
            }
        ]
    });
};
