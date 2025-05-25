const pool = require('../db');

const Producto = {
  getAll: async () => {
    const res = await pool.query('SELECT * FROM productos ORDER BY id ASC');
    return res.rows;
  },

  getById: async (id) => {
    const res = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);
    return res.rows[0];
  },

  create: async (data) => {
    const {
      nombre, precio, stock, imagen, codigo_barras, unidad_medida, categoria_id, moneda, descripcion, impuesto, descuento, tipo_id, destacado, codigo_unspsc, codigo_producto, inventario_id, fch_creacion, fch_actualizacion, estado
    } = data;

    const res = await pool.query(`
      INSERT INTO productos (
        nombre, precio, stock, imagen, codigo_barras, unidad_medida,
        categoria_id, moneda, descripcion, impuesto, descuento, tipo_id, destacado,
        codigo_unspsc, codigo_producto, inventario_id,
        fch_creacion, fch_actualizacion, estado
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
      )
      RETURNING *`,
      [
        nombre, precio, stock, imagen, codigo_barras, unidad_medida, categoria_id, moneda, descripcion, impuesto, descuento, tipo_id, destacado, codigo_unspsc, codigo_producto, inventario_id, fch_creacion, fch_actualizacion, estado
      ]);

    return res.rows[0];
  },
};

module.exports = Producto;
