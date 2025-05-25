const express = require('express');
const cors = require('cors');
const pool = require('./db');
const storeApiRoutes = require('./routes/storeApi');


const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use('/api', storeApiRoutes);

const initDb = async () => {
  try {
    // Eliminar tablas en orden correcto para evitar error FK
    await pool.query(`DROP TABLE IF EXISTS productos`);
    await pool.query(`DROP TABLE IF EXISTS inventarios`);
    await pool.query(`DROP TABLE IF EXISTS tipos`);
    await pool.query(`DROP TABLE IF EXISTS categorias`);

    // Crear tablas
    await pool.query(`
      CREATE TABLE categorias (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT,
        fch_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fch_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE tipos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT,
        fch_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fch_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE inventarios (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT,
        ubicacion TEXT,
        fch_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fch_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE productos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        precio DECIMAL(10, 2) NOT NULL,
        stock INTEGER NOT NULL,
        imagen TEXT,
        codigo_barras VARCHAR(100),
        unidad_medida VARCHAR(50),
        categoria_id INTEGER NULL REFERENCES categorias(id) ON DELETE SET NULL,
        moneda VARCHAR(20),
        descripcion TEXT,
        impuesto DECIMAL(5,2),
        tipo_id INTEGER NULL REFERENCES tipos(id) ON DELETE SET NULL,
        destacado BOOLEAN DEFAULT FALSE,
        codigo_unspsc VARCHAR(100),
        codigo_producto VARCHAR(100),
        inventario_id INTEGER NULL REFERENCES inventarios(id) ON DELETE SET NULL,
        fch_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fch_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        estado BOOLEAN DEFAULT TRUE
      );
    `);

    console.log('Tablas creadas (reiniciadas) correctamente');
  } catch (err) {
    console.error('Error al inicializar la base de datos:', err);
  }
};

app.get('/', (req, res) => {
  res.send('API corriendo correctamente');
});


app.listen(PORT, async () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  await initDb();
});
