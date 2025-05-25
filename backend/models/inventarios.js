const pool = require('../db');

const Inventario = {
  getAll: async () => {
    const res = await pool.query('SELECT * FROM inventarios ORDER BY id ASC');
    return res.rows;
  },
  getById: async (id) => {
    const res = await pool.query('SELECT * FROM inventarios WHERE id = $1', [id]);
    return res.rows[0];
  },
  create: async (data) => {
    const {
      nombre, abreviatura, descripcion, fch_creacion,
      fch_actualizacion, estado
    } = data;
    const res = await pool.query(`
      INSERT INTO inventarios (nombre, abreviatura, descripcion, fch_creacion, fch_actualizacion, estado)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [nombre, abreviatura, descripcion, fch_creacion, fch_actualizacion, estado]);
    return res.rows[0];
  },
};

module.exports = Inventario;
