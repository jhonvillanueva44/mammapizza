// routes/estadisticas.routes.js
import express from 'express';
import { getProductStatsService } from '../services/estadisticas.service.js';

const router = express.Router();

router.get('/productos', async (req, res) => {
  try {
    console.log('Solicitud recibida en /api/estadisticas/productos'); // Debug
    
    const stats = await getProductStatsService();
    
    console.log('Estadísticas obtenidas exitosamente:', stats); // Debug
    
    res.status(200).json({ 
      success: true, 
      data: stats,
      message: 'Estadísticas obtenidas correctamente'
    });
  } catch (error) {
    console.error('Error en ruta /productos:', error); // Debug
    
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Ruta de prueba para verificar que el endpoint funciona
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Endpoint de estadísticas funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

export default router;