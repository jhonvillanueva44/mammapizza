// Aqui se define la configuración del servidor express
import express from 'express';

import categoriasRoutes from './routes/categorias.routes.js';
import tamaniosRoutes from './routes/tamanios.routes.js';
import saboresRoutes from './routes/sabores.routes.js';
import tamanioSaborRoutes from './routes/tamanioSabor.routes.js';
import productosRoutes from './routes/productos.routes.js'; 
import unicosRoutes from './routes/unicos.routes.js';
import combinacionesRoutes from './routes/combinaciones.routes.js';
import promocionesRoutes from './routes/promociones.routes.js';
import detallesPromocionRoutes from './routes/detallesPromocion.routes.js';
import estadisticasRoutes from './routes/estadisticas.routes.js';
import path from 'path';

import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.resolve('uploads')));

app.get('/', (req, res) => { res.send('API corriendo correctamente');});


app.use('/api/categorias', categoriasRoutes);
app.use('/api/tamanios', tamaniosRoutes);
app.use('/api/sabores', saboresRoutes);
app.use('/api/tamaniosabor', tamanioSaborRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/unicos', unicosRoutes);
app.use('/api/combinaciones', combinacionesRoutes);
app.use('/api/promociones', promocionesRoutes )
app.use('/api/detallespromocion', detallesPromocionRoutes);
app.use('/api/estadisticas', estadisticasRoutes);

export default app;
