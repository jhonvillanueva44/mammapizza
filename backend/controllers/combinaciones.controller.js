import { createCombinacionService, findAllCombinacionesService } from '../services/combinaciones.service.js';

export const getCombinaciones = async (req, res) => {
  try {
    const combinaciones = await findAllCombinacionesService();
    res.json(combinaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las combinaciones.' });
  }
};

export const createCombinacion = async (req, res) => {
  try {
    const result = await createCombinacionService(req.body);

    if (result.reactivated) {
      return res.status(200).json({
        message: 'Combinación reactivada.',
        combinacion: result.combinacion
      });
    }

    res.status(201).json({
      message: 'Combinación creada.',
      combinacion: result.combinacion
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || 'Error interno del servidor' });
  }
};
