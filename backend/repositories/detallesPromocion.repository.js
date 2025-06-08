import { DetallePromocion } from '../models/DetallePromocion.js'

export const findAllDetallesPromocion = async () => {
  return await DetallePromocion.findAll({
    where: { estado: true },
    order: [['id', 'ASC']]
  })
}

export const findOneDetallePromocion = async ({ promocion_id, producto_id }) => {
  return await DetallePromocion.findOne({
    where: {
      promocion_id,
      producto_id
    }
  })
}

export const reactivateOneDetallePromocion = async (detalle) => {
  detalle.estado = true
  return await detalle.save()
}

export const createOneDetallePromocion = async (data) => {
  return await DetallePromocion.create(data)
}
