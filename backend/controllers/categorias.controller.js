import { createCategoriaService, findAllCategoriasService, updateCategoriaService, deleteCategoriaService } from '../services/categorias.service.js';

export const getCategorias = async (req, res) => {
    try {
        const categorias = await findAllCategoriasService();
        res.json(categorias);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las categorías' });
    }
}

export const createCategoria = async (req, res) => {
    try {
        const result = await createCategoriaService(req.body);

        if (result.reactivated) {
            return res.status(200).json({
                message: 'Categoría reactivada.',
                categoria: result.categoria
            });
        }

        res.status(201).json({
            message: 'Categoría creada.',
            categoria: result.categoria
        });
        
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || 'Error interno del servidor' });
    }
}

export const updateCategoria = async (req, res) => {
    try {
        const updated = await updateCategoriaService(req.params.id, req.body);
        res.json({ message: 'Categoría actualizada.', categoria: updated });
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || 'Error interno del servidor' });
    }
};

export const deleteCategoria = async (req, res) => {
    try {
        const deleted = await deleteCategoriaService(req.params.id);
        res.json({ message: 'Categoría desactivada.', categoria: deleted });
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || 'Error interno del servidor' });
    }
};