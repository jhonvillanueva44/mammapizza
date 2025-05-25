// CONEXION A LA BASE DE DATOS
const { Pool } = require('pg');

const pool = new Pool({
  user: 'db_mammapizza_user',
  host: 'dpg-d0p77s6uk2gs739bov00-a.oregon-postgres.render.com',
  database: 'db_mammapizza',
  password: 'IUc2VrOoONt1mlojjYkrRyLWmRtZDLSr',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;
