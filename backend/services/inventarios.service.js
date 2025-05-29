import { findAllInventarios, findOneInventario, createOneInventario, reactivateOneInventario } from '../repositories/inventarios.repository.js';

export const findAllInventariosService = async () => {
    return await findAllInventarios();
}  

export const createInventarioService = async (data) => {
    const requiredFields = ['nombre', 'abreviatura'];
    for (const field of requiredFields) {
        if (data[field] === undefined || data[field] === null) {
            throw { status: 400, message: `El campo '${field}' es obligatorio.` };
        }
    }

    const existing = await findOneInventario(data);

    if (existing) {
        if (existing.estado) {
            throw { status: 409, message: 'Ya existe un inventario activo con los mismos datos.' };
        }

        const reactivated = await reactivateOneInventario(existing);
        return { reactivated: true, inventario: reactivated };
    }

    const newInventario = await createOneInventario({ ...data, estado: true });

    return { created: true, inventario: newInventario };
}

