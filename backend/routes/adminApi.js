// IMPORTACIONES
const express = require('express');
const router = express.Router();
const pool = require('../db');
const Producto = require('../models/productos');
const Categoria = require('../models/categorias');
const Tipo = require('../models/tipos');
const Inventario = require('../models/inventarios');

// CREAR CATEGORÍA
router.post('/categorias', async (req, res) => {
  try {
    const requiredFields = ['nombre', 'abreviatura', 'nivel'];
    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null) {
        return res.status(400).json({ error: `El campo '${field}' es obligatorio.` });
      }
    }

    const { nombre, abreviatura, nivel, descripcion } = req.body;

    const existingQuery = `
      SELECT * FROM categorias 
      WHERE nombre = $1 AND COALESCE(abreviatura, '') = COALESCE($2, '') 
        AND COALESCE(nivel, -1) = COALESCE($3, -1) 
    `;

    const existing = await pool.query(existingQuery, [nombre, abreviatura, nivel]);

    if (existing.rowCount > 0) {
      const existingRow = existing.rows[0];

      if (existingRow.estado === true) {
        return res.status(409).json({ error: 'Ya existe una categoría activa con los mismos datos.' });
      } else {

        const updated = await pool.query(
          `UPDATE categorias 
           SET estado = true, fch_actualizacion = $1 
           WHERE id = $2
           RETURNING *`,
          [new Date(), existingRow.id]
        );
        return res.status(200).json({ message: 'Categoría reactivada.', categoria: updated.rows[0] });
      }
    }

    const now = new Date();
    const data = {
      nombre,
      abreviatura,
      nivel,
      descripcion,
      fch_creacion: now,
      fch_actualizacion: now,
      estado: true
    };


    const categoria = await Categoria.create(data);
    res.status(201).json({ message: 'Categoría creada.', categoria });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
});

// EDITAR CATEGORÍA
router.put('/categorias/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const existingById = await pool.query('SELECT * FROM categorias WHERE id = $1', [id]);
    if (existingById.rowCount === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada.' });
    }

    const categoriaActual = existingById.rows[0];

    if (!categoriaActual.estado) {
      return res.status(403).json({ error: 'No se puede editar una categoría inactiva.' });
    }

    const requiredFields = ['nombre', 'abreviatura', 'nivel'];
    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null) {
        return res.status(400).json({ error: `El campo '${field}' es obligatorio.` });
      }
    }

    const nombre = req.body.nombre;
    const abreviatura = req.body.abreviatura;
    const nivel = req.body.nivel;
    const descripcion = req.body.descripcion ?? null;

    const duplicateQuery = `
      SELECT * FROM categorias
      WHERE id <> $1
        AND nombre = $2
        AND COALESCE(abreviatura, '') = COALESCE($3, '')
        AND COALESCE(nivel, -1) = COALESCE($4, -1)
        AND estado = true
    `;

    const duplicate = await pool.query(duplicateQuery, [id, nombre, abreviatura, nivel]);

    if (duplicate.rowCount > 0) {
      return res.status(409).json({ error: 'Ya existe otra categoría activa con los mismos datos.' });
    }

    const now = new Date();

    const updateQuery = `
      UPDATE categorias
      SET nombre = $1,
          abreviatura = $2,
          nivel = $3,
          descripcion = $4,
          fch_actualizacion = $5
      WHERE id = $6
      RETURNING *
    `;

    const updated = await pool.query(updateQuery, [nombre, abreviatura, nivel, descripcion, now, id]);

    res.json({ message: 'Categoría actualizada.', categoria: updated.rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al editar categoría.' });
  }
});

// CREAR TIPO
router.post('/tipos', async (req, res) => {
  try {
    const requiredFields = ['nombre', 'abreviatura'];
    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null) {
        return res.status(400).json({ error: `El campo '${field}' es obligatorio.` });
      }
    }

    const { nombre, abreviatura, descripcion } = req.body;

    const existingQuery = `
      SELECT * FROM tipos 
      WHERE nombre = $1 
        AND abreviatura = $2
    `;

    const existing = await pool.query(existingQuery, [nombre, abreviatura]);

    if (existing.rowCount > 0) {
      const existingRow = existing.rows[0];
      if (existingRow.estado === true) {
        return res.status(409).json({ error: 'Ya existe un tipo activo con los mismos datos.' });
      } else {
        const updated = await pool.query(
          `UPDATE tipos 
           SET estado = true, fch_actualizacion = $1 
           WHERE id = $2
           RETURNING *`,
          [new Date(), existingRow.id]
        );
        return res.status(200).json({ message: 'Tipo reactivado.', tipo: updated.rows[0] });
      }
    }

    const now = new Date();
    const data = {
      nombre,
      abreviatura,
      descripcion,
      fch_creacion: now,
      fch_actualizacion: now,
      estado: true
    };

    const tipo = await Tipo.create(data);
    res.status(201).json({ message: 'Tipo creado.', tipo });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al procesar el tipo.' });
  }
});

// EDITAR TIPO
router.put('/tipos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const existingById = await pool.query('SELECT * FROM tipos WHERE id = $1', [id]);
    if (existingById.rowCount === 0) {
      return res.status(404).json({ error: 'Tipo no encontrado.' });
    }

    const tipoActual = existingById.rows[0];
    if (!tipoActual.estado) {
      return res.status(403).json({ error: 'No se puede editar un tipo inactivo.' });
    }

    const requiredFields = ['nombre', 'abreviatura'];
    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null) {
        return res.status(400).json({ error: `El campo '${field}' es obligatorio.` });
      }
    }

    const nombre = req.body.nombre;
    const abreviatura = req.body.abreviatura;
    const descripcion = req.body.descripcion ?? null;

    const duplicateQuery = `
      SELECT * FROM tipos
      WHERE id <> $1
        AND nombre = $2
        AND abreviatura = $3
        AND estado = true
    `;

    const duplicate = await pool.query(duplicateQuery, [id, nombre, abreviatura]);
    if (duplicate.rowCount > 0) {
      return res.status(409).json({ error: 'Ya existe otro tipo activo con los mismos datos.' });
    }

    const now = new Date();

    const updateQuery = `
      UPDATE tipos
      SET nombre = $1,
          abreviatura = $2,
          descripcion = $3,
          fch_actualizacion = $4
      WHERE id = $5
      RETURNING *
    `;

    const updated = await pool.query(updateQuery, [nombre, abreviatura, descripcion, now, id]);
    res.json({ message: 'Tipo actualizado.', tipo: updated.rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al editar tipo.' });
  }
});

// CREAR INVENTARIO
router.post('/inventarios', async (req, res) => {
  try {
    const requiredFields = ['nombre', 'abreviatura'];
    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null) {
        return res.status(400).json({ error: `El campo '${field}' es obligatorio.` });
      }
    }

    const { nombre, abreviatura, descripcion } = req.body;

    const existingQuery = `
      SELECT * FROM inventarios 
      WHERE nombre = $1 
        AND abreviatura = $2
    `;

    const existing = await pool.query(existingQuery, [nombre, abreviatura]);

    if (existing.rowCount > 0) {
      const existingRow = existing.rows[0];
      if (existingRow.estado === true) {
        return res.status(409).json({ error: 'Ya existe un inventario activo con los mismos datos.' });
      } else {
        const updated = await pool.query(
          `UPDATE inventarios 
           SET estado = true, fch_actualizacion = $1 
           WHERE id = $2
           RETURNING *`,
          [new Date(), existingRow.id]
        );
        return res.status(200).json({ message: 'Inventario reactivado.', inventario: updated.rows[0] });
      }
    }

    const now = new Date();
    const data = {
      nombre,
      abreviatura,
      descripcion,
      fch_creacion: now,
      fch_actualizacion: now,
      estado: true
    };

    const inventario = await Inventario.create(data);
    res.status(201).json({ message: 'Inventario creado.', inventario });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al procesar el inventario.' });
  }
});

// EDITAR INVENTARIO
router.put('/inventarios/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const existingById = await pool.query('SELECT * FROM inventarios WHERE id = $1', [id]);
    if (existingById.rowCount === 0) {
      return res.status(404).json({ error: 'Inventario no encontrado.' });
    }

    const inventarioActual = existingById.rows[0];
    if (!inventarioActual.estado) {
      return res.status(403).json({ error: 'No se puede editar un inventario inactivo.' });
    }

    const requiredFields = ['nombre', 'abreviatura'];
    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null) {
        return res.status(400).json({ error: `El campo '${field}' es obligatorio.` });
      }
    }

    const nombre = req.body.nombre;
    const abreviatura = req.body.abreviatura;
    const descripcion = req.body.descripcion ?? null;

    const duplicateQuery = `
      SELECT * FROM inventarios
      WHERE id <> $1
        AND nombre = $2
        AND abreviatura = $3
        AND estado = true
    `;

    const duplicate = await pool.query(duplicateQuery, [id, nombre, abreviatura]);
    if (duplicate.rowCount > 0) {
      return res.status(409).json({ error: 'Ya existe otro inventario activo con los mismos datos.' });
    }

    const now = new Date();

    const updateQuery = `
      UPDATE inventarios
      SET nombre = $1,
          abreviatura = $2,
          descripcion = $3,
          fch_actualizacion = $4
      WHERE id = $5
      RETURNING *
    `;

    const updated = await pool.query(updateQuery, [nombre, abreviatura, descripcion, now, id]);
    res.json({ message: 'Inventario actualizado.', inventario: updated.rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al editar inventario.' });
  }
});

// CREAR PRODUCTO
router.post('/productos', async (req, res) => {
  try {
    const requiredFields = ['nombre', 'categoria_id', 'tipo_id', 'inventario_id'];
    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null) {
        return res.status(400).json({ error: `El campo '${field}' es obligatorio.` });
      }
    }

    const {
      nombre, precio, stock, imagen, codigo_barras, unidad_medida,
      categoria_id, moneda, descripcion, impuesto, descuento, tipo_id,
      destacado, codigo_unspsc, codigo_producto, inventario_id
    } = req.body;

    const existingQuery = `
      SELECT * FROM productos 
      WHERE nombre = $1 AND categoria_id = $2 AND tipo_id = $3 AND inventario_id = $4
    `;

    const existing = await pool.query(existingQuery, [nombre, categoria_id, tipo_id, inventario_id]);

    const now = new Date();

    if (existing.rowCount > 0) {
      const existingRow = existing.rows[0];
      if (existingRow.estado === true) {
        return res.status(409).json({ error: 'Ya existe un producto activo con los mismos datos.' });
      } else {
        const updated = await pool.query(
          `UPDATE productos 
           SET estado = true, fch_actualizacion = $1 
           WHERE id = $2 
           RETURNING *`,
          [now, existingRow.id]
        );
        return res.status(200).json({ message: 'Producto reactivado.', producto: updated.rows[0] });
      }
    }

    const data = {
      nombre,
      precio,
      stock,
      imagen,
      codigo_barras,
      unidad_medida,
      categoria_id,
      moneda,
      descripcion,
      impuesto,
      descuento,
      tipo_id,
      destacado,
      codigo_unspsc,
      codigo_producto,
      inventario_id,
      fch_creacion: now,
      fch_actualizacion: now,
      estado: true
    };

    const producto = await Producto.create(data);
    res.status(201).json({ message: 'Producto creado.', producto });

  } catch (err) {
    res.status(500).json({ error: 'Error al procesar el producto.' });
  }
});

// EDITAR PRODUCTO
router.put('/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const existingById = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);
    if (existingById.rowCount === 0) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    const productoActual = existingById.rows[0];
    if (!productoActual.estado) {
      return res.status(403).json({ error: 'No se puede editar un producto inactivo.' });
    }

    const requiredFields = ['nombre', 'categoria_id', 'tipo_id', 'inventario_id'];
    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null) {
        return res.status(400).json({ error: `El campo '${field}' es obligatorio.` });
      }
    }

    const nombre = req.body.nombre;
    const precio = req.body.precio ?? null;
    const stock = req.body.stock ?? null;
    const imagen = req.body.imagen ?? null;
    const codigo_barras = req.body.codigo_barras ?? null;
    const unidad_medida = req.body.unidad_medida ?? null;
    const categoria_id = req.body.categoria_id;
    const moneda = req.body.moneda ?? null;
    const descripcion = req.body.descripcion ?? null;
    const impuesto = req.body.impuesto ?? null;
    const descuento = req.body.descuento;
    const tipo_id = req.body.tipo_id;
    const destacado = req.body.destacado ?? null;
    const codigo_unspsc = req.body.codigo_unspsc ?? null;
    const codigo_producto = req.body.codigo_producto ?? null;
    const inventario_id = req.body.inventario_id;

    const duplicateQuery = `
      SELECT * FROM productos
      WHERE id <> $1
        AND nombre = $2
        AND categoria_id = $3
        AND tipo_id = $4
        AND inventario_id = $5
        AND estado = true
    `;

    const duplicate = await pool.query(duplicateQuery, [id, nombre, categoria_id, tipo_id, inventario_id]);
    if (duplicate.rowCount > 0) {
      return res.status(409).json({ error: 'Ya existe otro producto activo con los mismos datos.' });
    }

    const now = new Date();

    const updateQuery = `
      UPDATE productos SET
        nombre = $1,
        precio = $2,
        stock = $3,
        imagen = $4,
        codigo_barras = $5,
        unidad_medida = $6,
        categoria_id = $7,
        moneda = $8,
        descripcion = $9,
        impuesto = $10,
        descuento = $11,
        tipo_id = $12,
        destacado = $13,
        codigo_unspsc = $14,
        codigo_producto = $15,
        inventario_id = $16,
        fch_actualizacion = $17
      WHERE id = $18
      RETURNING *
    `;

    const values = [
      nombre,
      precio,
      stock,
      imagen,
      codigo_barras,
      unidad_medida,
      categoria_id,
      moneda,
      descripcion,
      impuesto,
      descuento,
      tipo_id,
      destacado,
      codigo_unspsc,
      codigo_producto,
      inventario_id,
      now,
      id
    ];

    const updated = await pool.query(updateQuery, values);

    res.json({ message: 'Producto actualizado.', producto: updated.rows[0] });

  } catch (err) {
    console.error('Error al editar producto:', err);
    res.status(500).json({ error: 'Error al editar producto.' });
  }
});

module.exports = router;