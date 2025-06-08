import {
  getAllPromocionesService,
  createPromocionService
} from '../services/promociones.service.js'

export const getPromociones = async (req, res) => {
  try {
    const promociones = await getAllPromocionesService()

    const fullUrl = `${req.protocol}://${req.get('host')}`
    const promocionesConImagenAbsoluta = promociones.map(promo => ({
      ...promo.toJSON(),
      imagen: promo.imagen
        ? `${fullUrl}${promo.imagen}`
        : `${fullUrl}/uploads/default.jpeg`
    }))

    res.json(promocionesConImagenAbsoluta)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener las promociones' })
  }
}

export const createPromocion = async (req, res) => {
  try {
    const data = req.body

    const sanitize = (value) => {
      if (value === '' || value === undefined || value === null) return null
      return isNaN(value) ? value : Number(value)
    }

    let imagePath = req.file ? `/uploads/${req.file.filename}` : '/uploads/default.jpeg'

    const promocionData = {
      nombre: data.nombre,
      precio: sanitize(data.precio),
      stock: sanitize(data.stock),
      categoria_id: sanitize(data.categoria_id),
      descripcion: data.descripcion || null,
      impuesto: sanitize(data.impuesto),
      descuento: sanitize(data.descuento),
      destacado: data.destacado === 'true',
      habilitado: data.habilitado === 'true',
      imagen: imagePath
    }

    const result = await createPromocionService(promocionData)

    if (result.reactivated) {
      return res.status(200).json({
        message: 'Promoción reactivada.',
        promocion: result.promocion
      })
    }

    res.status(201).json({
      message: 'Promoción creada.',
      promocion: result.promocion
    })
  } catch (error) {
    console.error(error)
    res.status(error.status || 500).json({ error: error.message || 'Error interno del servidor' })
  }
}
