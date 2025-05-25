// IMPORTACIONES
const express = require('express');
const router = express.Router();
const pool = require('../db');
const Producto = require('../models/productos');
const Categoria = require('../models/categorias');
const Tipo = require('../models/tipos');
const Inventario = require('../models/inventarios');

// PRODUCTOS POR CATEGORÍA DE NIVEL
router.get('/productos/categorias', async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT * FROM productos WHERE categoria_id != 3
    `);
    res.json(resultado.rows);
  } catch (err) {
    console.error('Error al obtener productos filtrados:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PRODUCTOS POR CATEGORÍA DE PROMOCIONES
router.get('/productos/promociones', async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT * 
      FROM productos
      WHERE categoria_id = (
        SELECT c.id 
        FROM categorias c
        WHERE UPPER(c.nombre) = 'PROMOCIONES'
        LIMIT 1
      )
    `);

    res.json(resultado.rows);
  } catch (err) {
    console.error('Error al obtener productos promocionales:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// CATEGORIAS
router.get('/categorias', async (req, res) => {
  try {
    const data = await Categoria.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

// TIPOS
router.get('/tipos', async (req, res) => {
  try {
    const data = await Tipo.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener tipos' });
  }
});

// INVENTARIOS
router.get('/inventarios', async (req, res) => {
  try {
    const data = await Inventario.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener inventarios' });
  }
});

// PRODUCTOS
router.get('/productos', async (req, res) => {
  try {
    const data = await Producto.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// CREAR PRODUCTO
router.post('/productos', async (req, res) => {
  try {
    const producto = await Producto.create(req.body);
    res.status(201).json(producto);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear producto', detalle: err.message });
  }
});

module.exports = router;
