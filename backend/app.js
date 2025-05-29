// Aqui se define la configuración del servidor express
import express from 'express';
import categoriasRoutes from './routes/categorias.routes.js';
import tiposRoutes from './routes/tipos.routes.js';
import inventariosRoutes from './routes/inventarios.routes.js';
import productosRoutes from './routes/productos.routes.js'; 
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => { res.send('API corriendo correctamente');});

app.use('/api/categorias', categoriasRoutes);
app.use('/api/tipos', tiposRoutes);
app.use('/api/inventarios', inventariosRoutes);
app.use('/api/productos', productosRoutes);

export default app;
