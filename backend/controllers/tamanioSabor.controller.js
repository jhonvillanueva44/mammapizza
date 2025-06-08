import { createTamanioSaborService, findAllTamaniosSaboresService } from '../services/tamanioSabor.service.js';

export const getTamaniosSabores = async (req, res) => {
  try {
    const tamanios = await findAllTamaniosSaboresService();
    res.json(tamanios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los tamaños de sabor' });
  }
};

export const createTamanioSabor = async (req, res) => {
  try {
    const result = await createTamanioSaborService(req.body);

    if (result.reactivated) {
      return res.status(200).json({
        message: 'Tamaño-sabor reactivado.',
        tamanioSabor: result.tamanioSabor
      });
    }

    res.status(201).json({
      message: 'Tamaño-sabor creado.',
      tamanioSabor: result.tamanioSabor
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || 'Error interno del servidor' });
  }
};
