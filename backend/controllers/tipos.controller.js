import { findAllTiposService, createTipoService } from '../services/tipos.service.js';

export const getTipos = async (req, res) => {
    try {
        const tipos = await findAllTiposService();
        res.json(tipos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los tipos' });
    }
}

export const createTipo = async (req, res) => {
    try {
        const result = await createTipoService(req.body);

        if (result.reactivated) {
            return res.status(200).json({
                message: 'Tipo reactivado.',
                tipo: result.tipo
            });
        }

        res.status(201).json({
            message: 'Tipo creado.',
            tipo: result.tipo
        });
        
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || 'Error interno del servidor' });
    }
}

