import { createUnicoService, findAllUnicosService } from '../services/unicos.service.js';

export const getUnicos = async (req, res) => {
  try {
    const unicos = await findAllUnicosService();
    res.json(unicos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los sabores unicos.' });
  }
};

export const createUnico = async (req, res) => {
  try {
    const result = await createUnicoService(req.body);

    if (result.reactivated) {
      return res.status(200).json({
        message: 'Unico sabor reactivado.',
        unico: result.unico
      });
    }

    res.status(201).json({
      message: 'Unico sabor creado.',
      unico: result.unico
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || 'Error interno del servidor' });
  }
};
