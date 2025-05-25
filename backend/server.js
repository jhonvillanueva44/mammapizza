// IMPORTACIONES
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const storeApiRoutes = require('./routes/storeApi');
const adminApiRoutes = require('./routes/adminApi');

// DECLARAMOS VARIABLES DE PUERTO Y EXPRESS
const app = express();
const PORT = 4000;

// USO DE EXPRESS Y CORS
app.use(cors());
app.use(express.json());

// RUTA PRINCIPAL
app.get('/', (req, res) => {
  res.send('API corriendo correctamente');
});

// RUTAS AL API
app.use('/api', storeApiRoutes);
app.use('/api/admin', adminApiRoutes);

/*const initDb = async () => {
  try {
    //await pool.query(`DROP TABLE IF EXISTS productos`);
    //await pool.query(`DROP TABLE IF EXISTS inventarios`);
    //await pool.query(`DROP TABLE IF EXISTS tipos`);
    //await pool.query(`DROP TABLE IF EXISTS categorias`);

    // Crear tablas
    await pool.query(`
      CREATE TABLE categorias (
          id SERIAL PRIMARY KEY,
          nombre VARCHAR(250) NOT NULL,
          abreviatura VARCHAR(10) NOT NULL,
          nivel INTEGER NOT NULL,
          descripcion TEXT NULL,
          fch_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          fch_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          estado BOOLEAN NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE tipos (
          id SERIAL PRIMARY KEY,
          nombre VARCHAR(250) NOT NULL,
          abreviatura VARCHAR(10) NOT NULL,
          descripcion TEXT NULL,
          fch_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          fch_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          estado BOOLEAN NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE inventarios (
          id SERIAL PRIMARY KEY,
          nombre VARCHAR(250) NOT NULL,
          abreviatura VARCHAR(10),
          descripcion TEXT NULL,
          fch_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          fch_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          estado BOOLEAN NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE productos (
          id SERIAL PRIMARY KEY,
          nombre VARCHAR(250) NOT NULL,
          precio NUMERIC(10,2) NULL,
          stock INTEGER NULL,
          imagen TEXT NULL,
          codigo_barras VARCHAR(50) NULL,
          unidad_medida VARCHAR(20) NULL,
          categoria_id INTEGER REFERENCES categorias(id),
          moneda VARCHAR(10) NULL,
          descripcion TEXT NULL,
          impuesto INTEGER NULL,
          descuento INTEGER NULL,
          tipo_id INTEGER REFERENCES tipos(id),
          destacado BOOLEAN DEFAULT FALSE,
          codigo_unspsc VARCHAR(50) NULL,
          codigo_producto VARCHAR(50) NULL,
          inventario_id INTEGER REFERENCES inventarios(id),
          fch_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          fch_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          estado BOOLEAN NOT NULL
      );
    `);

    console.log('Tablas creadas (reiniciadas) correctamente');
  } catch (err) {
    console.error('Error al inicializar la base de datos:', err);
  }
};*/

// ACTIVAMOS EL SERVIDOR
app.listen(PORT, async () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  //await initDb();
});
