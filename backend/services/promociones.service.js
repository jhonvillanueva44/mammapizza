import {
  findAllPromocionesWithDetalles,
  findOnePromocion,
  createOnePromocion,
  reactivateOnePromocion
} from '../repositories/promociones.repository.js'

export const getAllPromocionesService = async () => {
  return await findAllPromocionesWithDetalles()
}

export const createPromocionService = async (data) => {
  const requiredFields = ['nombre', 'categoria_id']
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null) {
      throw { status: 400, message: `El campo '${field}' es obligatorio.` }
    }
  }

  const existing = await findOnePromocion(data)

  if (existing) {
    if (existing.estado) {
      throw { status: 409, message: 'Ya existe una promoción activa con los mismos datos.' }
    }

    const reactivated = await reactivateOnePromocion(existing)
    return { reactivated: true, promocion: reactivated }
  }

  const nuevaPromocion = await createOnePromocion({ ...data, estado: true })
  return { created: true, promocion: nuevaPromocion }
}
