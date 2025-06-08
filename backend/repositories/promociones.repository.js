import { Promocion } from '../models/Promocion.js'
import { DetallePromocion } from '../models/DetallePromocion.js'

export const findAllPromocionesWithDetalles = async () => {
  return await Promocion.findAll({
    where: { estado: true },
    order: [['id', 'ASC']],
    include: [DetallePromocion]
  })
}

export const findOnePromocion = async ({ nombre, categoria_id }) => {
  return await Promocion.findOne({
    where: {
      nombre,
      categoria_id
    }
  })
}

export const reactivateOnePromocion = async (promocion) => {
  promocion.estado = true
  return await promocion.save()
}

export const createOnePromocion = async (data) => {
  return await Promocion.create(data)
}
