const pool = require('../db');

const Categoria = {
  getAll: async () => {
    const res = await pool.query('SELECT * FROM categorias ORDER BY id ASC');
    return res.rows;
  },

  getById: async (id) => {
    const res = await pool.query('SELECT * FROM categorias WHERE id = $1', [id]);
    return res.rows[0];
  },

  create: async (data) => {
    const {
      nombre, abreviatura, nivel, descripcion, fch_creacion,
      fch_actualizacion, estado
    } = data;
    const res = await pool.query(`
      INSERT INTO categorias (nombre, abreviatura, nivel, descripcion, fch_creacion, fch_actualizacion, estado)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [nombre, abreviatura, nivel, descripcion, fch_creacion, fch_actualizacion, estado]);
    return res.rows[0];
  },
};

module.exports = Categoria;
