
import { createTamanioService, findAllTamaniosService } from '../services/tamanios.service.js';

export const getTamanios = async (req, res) => {
    try {
        const tamanios = await findAllTamaniosService();
        res.json(tamanios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los tamaños.' });
    }
}

export const createTamanio = async (req, res) => {
    try {
        const result = await createTamanioService(req.body);

        if (result.reactivated) {
            return res.status(200).json({
                message: 'Tamaño reactivada.',
                tamanio: result.tamanio
            });
        }

        res.status(201).json({
            message: 'Tamaño creado.',
            tamanio: result.tamanio
        });
        
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || 'Error interno del servidor' });
    }
}
