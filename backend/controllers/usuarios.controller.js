import { findAllUsuariosService, findOneUsuarioService } from '../services/usuarios.service.js';

export const getUsuarios = async (req, res) => {
    try {
        const usuarios = await findAllUsuariosService();
        res.json(usuarios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
};

export const getUsuario = async (req, res) => {
    try {
        const usuario = await findOneUsuarioService(req.params.id);
        res.json(usuario);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || 'Error interno del servidor' });
    }
};