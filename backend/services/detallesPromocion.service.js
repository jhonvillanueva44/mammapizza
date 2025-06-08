import {
  findAllDetallesPromocion,
  findOneDetallePromocion,
  createOneDetallePromocion,
  reactivateOneDetallePromocion
} from '../repositories/detallesPromocion.repository.js'

export const findAllDetallesPromocionService = async () => {
  return await findAllDetallesPromocion()
}

export const createDetallePromocionService = async (data) => {
  const requiredFields = ['promocion_id', 'producto_id']

  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null) {
      throw { status: 400, message: `El campo '${field}' es obligatorio.` }
    }
  }

  const existing = await findOneDetallePromocion(data)

  if (existing) {
    if (existing.estado) {
      throw {
        status: 409,
        message: 'Ya existe un detalle de promoción activo para este producto.'
      }
    }

    const reactivated = await reactivateOneDetallePromocion(existing)
    return { reactivated: true, detalle: reactivated }
  }

  const newDetalle = await createOneDetallePromocion({ ...data, estado: true })
  return { created: true, detalle: newDetalle }
}
