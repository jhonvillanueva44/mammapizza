import {
  createSaborService,
  findAllSaboresService,
  updateSaborService,
  deleteSaborService
} from '../services/sabores.service.js';

export const getSabores = async (req, res) => {
  try {
    const sabores = await findAllSaboresService();
    res.json(sabores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los sabores' });
  }
};

export const createSabor = async (req, res) => {
  try {
    const result = await createSaborService(req.body);

    if (result.reactivated) {
      return res.status(200).json({
        message: 'Sabor reactivado.',
        sabor: result.sabor
      });
    }

    res.status(201).json({
      message: 'Sabor creado.',
      sabor: result.sabor
    });

  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || 'Error interno del servidor' });
  }
};

export const updateSabor = async (req, res) => {
  try {
    const updated = await updateSaborService(req.params.id, req.body);
    res.json({ message: 'Sabor actualizado.', sabor: updated });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || 'Error interno del servidor' });
  }
};

export const deleteSabor = async (req, res) => {
  try {
    const deleted = await deleteSaborService(req.params.id);
    res.json({ message: 'Sabor desactivado.', sabor: deleted });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || 'Error interno del servidor' });
  }
};
