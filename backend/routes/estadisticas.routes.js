import express from 'express';
import { getProductStatsService } from '../services/estadisticas.service.js';
import config  from '../config/config.js';

const router = express.Router();

router.get('/productos', async (req, res) => {
  try {    
    const stats = await getProductStatsService();
        
    res.status(200).json({ 
      success: true, 
      data: stats,
      message: 'Estadísticas obtenidas correctamente'
    });
  } catch (error) {
    
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error interno del servidor',
      error: config.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Endpoint de estadísticas funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

export default router;