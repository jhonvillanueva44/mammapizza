import {
  findAllDetallesPromocionService,
  createDetallePromocionService
} from '../services/detallesPromocion.service.js'

export const getDetallesPromocion = async (req, res) => {
  try {
    const detalles = await findAllDetallesPromocionService()
    res.json(detalles)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener los detalles de promoción.' })
  }
}

export const createDetallePromocion = async (req, res) => {
  try {
    const result = await createDetallePromocionService(req.body)

    if (result.reactivated) {
      return res.status(200).json({
        message: 'Detalle de promoción reactivado.',
        detalle: result.detalle
      })
    }

    res.status(201).json({
      message: 'Detalle de promoción creado.',
      detalle: result.detalle
    })
  } catch (error) {
    console.error(error)
    res.status(error.status || 500).json({
      error: error.message || 'Error interno del servidor'
    })
  }
}
