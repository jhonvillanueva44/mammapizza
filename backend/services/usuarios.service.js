import { findAllUsuarios, findOneUsuario } from '../repositories/usuarios.repository.js';

export const findAllUsuariosService = async () => {
    return await findAllUsuarios();
};

export const findOneUsuarioService = async (id) => {
    const usuario = await findOneUsuario(id);
    if (!usuario) throw { status: 404, message: 'Usuario no encontrado' };
    return usuario;
};