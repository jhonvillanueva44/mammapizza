import {
  createTamanioService,
  findAllTamaniosService,
  updateTamanioService,
  deleteTamanioService,
  findTamaniosPizzaService,
  findTamaniosCalzoneService,
  findTamaniosPastaService,
  findTamaniosAgregadoService,
  findTamaniosBebidaService
} from '../services/tamanios.service.js';

export const getTamanios = async (req, res) => {
  try {
    const tamanios = await findAllTamaniosService();
    res.json(tamanios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los tamaños.' });
  }
};

export const createTamanio = async (req, res) => {
  try {
    const result = await createTamanioService(req.body);

    if (result.reactivated) {
      return res.status(200).json({
        message: 'Tamaño reactivado.',
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
};

export const updateTamanio = async (req, res) => {
  try {
    const updated = await updateTamanioService(req.params.id, req.body);
    res.json({ message: 'Tamaño actualizado.', tamanio: updated });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || 'Error interno del servidor' });
  }
};

export const deleteTamanio = async (req, res) => {
  try {
    const deleted = await deleteTamanioService(req.params.id);
    res.json({ message: 'Tamaño desactivado.', tamanio: deleted });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || 'Error interno del servidor' });
  }
};

export const getTamaniosPizza = async (req, res) => {
  try {
    const tamanios = await findTamaniosPizzaService();
    res.json(tamanios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener tamaños tipo Pizza.' });
  }
};

export const getTamaniosCalzone = async (req, res) => {
  try {
    const tamanios = await findTamaniosCalzoneService();
    res.json(tamanios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener tamaños tipo Calzone.' });
  }
};

export const getTamaniosPasta = async (req, res) => {
  try {
    const tamanios = await findTamaniosPastaService();
    res.json(tamanios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener tamaños tipo Pasta.' });
  }
};

export const getTamaniosAgregado = async (req, res) => {
  try {
    const tamanios = await findTamaniosAgregadoService();
    res.json(tamanios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener tamaños tipo Agregado.' });
  }
};

export const getTamaniosBebida = async (req, res) => {
  try {
    const tamanios = await findTamaniosBebidaService();
    res.json(tamanios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener tamaños tipo Bebida.' });
  }
};
