import {
  getProductosPorCategoria,
  getStockPorCategoria,
  getPreciosPromedio
} from '../repositories/estadisticas.repository.js';

export const getProductStatsService = async () => {
  try {
    const productosPorCategoria = await getProductosPorCategoria();
    const stockPorCategoria = await getStockPorCategoria();
    const preciosPromedio = await getPreciosPromedio();

    const processedData = {
      productosPorCategoria: productosPorCategoria.map(item => ({
        categoria: item.categoria,
        cantidad: parseInt(item.cantidad) || 0
      })),
      stockPorCategoria: stockPorCategoria.map(item => ({
        categoria: item.categoria,
        stock: parseInt(item.stock) || 0
      })),
      preciosPromedio: preciosPromedio.map(item => ({
        categoria: item.categoria,
        precio_promedio: parseFloat(item.precio_promedio) || 0
      }))
    };

    return processedData;
  } catch (error) {
    console.error('Error en getProductStatsService:', error);
    throw new Error(`Error al obtener estadísticas: ${error.message}`);
  }
};
