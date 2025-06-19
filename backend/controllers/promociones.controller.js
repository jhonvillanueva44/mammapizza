import { 
    findAllPromocionesService, 
    findOnePromocionService,
    createPromocionService,
    updatePromocionService,
    deletePromocionService 
} from '../services/promociones.service.js';

export const getPromociones = async (req, res) => {
    try {
        const promociones = await findAllPromocionesService();

        const fullUrl = `${req.protocol}://${req.get('host')}`;

        const promocionesConImagenAbsoluta = promociones.map(promocion => ({
            ...promocion.toJSON(),
            imagen: promocion.imagen
                ? `${fullUrl}${promocion.imagen}`
                : `${fullUrl}/uploads/default.jpeg`,
            detalles_promocion: promocion.detalles_promocion.map(detalle => ({
                ...detalle.toJSON(),
                producto: {
                    ...detalle.producto.toJSON(),
                    imagen: detalle.producto.imagen
                        ? `${fullUrl}${detalle.producto.imagen}`
                        : `${fullUrl}/uploads/default.jpeg`
                }
            }))
        }));

        res.json(promocionesConImagenAbsoluta);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ 
            error: error.message || 'Error al obtener las promociones' 
        });
    }
};

export const getPromocionById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const promocion = await findOnePromocionService(id);

        const fullUrl = `${req.protocol}://${req.get('host')}`;
        const promocionConImagen = {
            ...promocion.toJSON(),
            imagen: promocion.imagen
                ? `${fullUrl}${promocion.imagen}`
                : `${fullUrl}/uploads/default.jpeg`,
            detalles_promocion: promocion.detalles_promocion.map(detalle => ({
                ...detalle.toJSON(),
                producto: {
                    ...detalle.producto.toJSON(),
                    imagen: detalle.producto.imagen
                        ? `${fullUrl}${detalle.producto.imagen}`
                        : `${fullUrl}/uploads/default.jpeg`
                }
            }))
        };

        res.json(promocionConImagen);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ 
            error: error.message || 'Error al obtener la promoción' 
        });
    }
};

export const createPromocion = async (req, res) => {
    try {
        const data = req.body;
        const file = req.file;

        const sanitize = (value) => {
            if (value === '' || value === undefined || value === null) return null;
            return isNaN(value) ? value : Number(value);
        };

        let imagePath = file ? `/uploads/${file.filename}` : '/uploads/default-promo.jpg';

        // Parsear productos desde string JSON
        let productos = [];
        try {
            productos = JSON.parse(data.productos || '[]');
        } catch (e) {
            throw { status: 400, message: 'Formato inválido para productos. Debe ser un array JSON.' };
        }

        const promocionData = {
            nombre: data.nombre,
            precio: sanitize(data.precio),
            stock: sanitize(data.stock),
            imagen: imagePath,
            descripcion: data.descripcion || null,
            impuesto: sanitize(data.impuesto),
            descuento: sanitize(data.descuento),
            destacado: data.destacado === 'true',
            habilitado: data.habilitado === 'true',
            productos: productos  // Usamos el array parseado
        };

        const result = await createPromocionService(promocionData);

        if (result.reactivated) {
            return res.status(200).json({
                message: 'Promoción reactivada exitosamente.',
                promocion: result.promocion
            });
        }

        res.status(201).json({
            message: 'Promoción creada exitosamente.',
            promocion: result.promocion
        });

    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ 
            error: error.message || 'Error interno del servidor' 
        });
    }
};

export const updatePromocion = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;
        const file = req.file;

        const sanitize = (value) => {
            if (value === '' || value === undefined || value === null) return null;
            return isNaN(value) ? value : Number(value);
        };

        // Parsear productos desde string JSON
        let productos = [];
        try {
            productos = JSON.parse(data.productos || '[]');
        } catch (e) {
            throw { status: 400, message: 'Formato inválido para productos. Debe ser un array JSON.' };
        }

        const promocionData = {
            nombre: data.nombre,
            precio: sanitize(data.precio),
            stock: sanitize(data.stock),
            descripcion: data.descripcion || null,
            impuesto: sanitize(data.impuesto),
            descuento: sanitize(data.descuento),
            destacado: data.destacado === 'true',
            habilitado: data.habilitado === 'true',
            productos: productos  // Usamos el array parseado
        };

        if (file) {
            promocionData.imagen = `/uploads/${file.filename}`;
        }

        const updated = await updatePromocionService(id, promocionData);
        res.status(200).json({ 
            message: 'Promoción actualizada exitosamente.', 
            promocion: updated 
        });

    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ 
            error: error.message || 'Error al actualizar la promoción.' 
        });
    }
};

export const deletePromocion = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const deleted = await deletePromocionService(id);
        res.status(200).json({ 
            message: 'Promoción desactivada.', 
            promocion: deleted 
        });
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ 
            error: error.message || 'Error al desactivar la promoción.' 
        });
    }
};