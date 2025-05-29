import { findAllInventariosService, createInventarioService } from '../services/inventarios.service.js';

export const getInventarios = async (req, res) => {
    try {
        const inventarios = await findAllInventariosService();
        res.json(inventarios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los inventarios' });
    }
}

export const createInventario = async (req, res) => {
    try {
        const result = await createInventarioService(req.body);

        if (result.reactivated) {
            return res.status(200).json({
                message: 'Inventario reactivado.',
                inventario: result.inventario
            });
        }

        res.status(201).json({
            message: 'Inventario creado.',
            inventario: result.inventario
        });
        
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || 'Error interno del servidor' });
    }
}
