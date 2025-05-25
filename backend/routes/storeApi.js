const express = require('express');
const router = express.Router();
const pool = require('../db');  // IMPORTANTE: subir nivel para encontrar db.js
const Producto = require('../models/productos');
const Categoria = require('../models/categorias');
const Tipo = require('../models/tipos');
const Inventario = require('../models/inventarios');

// Productos
router.get('/productos', async (req, res) => {
  try {
    const data = await Producto.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

router.post('/productos', async (req, res) => {
  try {
    const producto = await Producto.create(req.body);
    res.status(201).json(producto);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear producto', detalle: err.message });
  }
});

// Filtros productos
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

router.get('/productos/promociones', async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT * FROM productos WHERE categoria_id = 4
    `);
    res.json(resultado.rows);
  } catch (err) {
    console.error('Error al obtener productos promocionales:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Categorías
router.get('/categorias', async (req, res) => {
  try {
    const data = await Categoria.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

router.post('/categorias', async (req, res) => {
  try {
    const categoria = await Categoria.create(req.body);
    res.status(201).json(categoria);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear categoría' });
  }
});

// Tipos
router.get('/tipos', async (req, res) => {
  try {
    const data = await Tipo.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener tipos' });
  }
});

router.post('/tipos', async (req, res) => {
  try {
    const tipo = await Tipo.create(req.body);
    res.status(201).json(tipo);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear tipo' });
  }
});

// Inventarios
router.get('/inventarios', async (req, res) => {
  try {
    const data = await Inventario.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener inventarios' });
  }
});

router.post('/inventarios', async (req, res) => {
  try {
    const inventario = await Inventario.create(req.body);
    res.status(201).json(inventario);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear inventario' });
  }
});

module.exports = router;
