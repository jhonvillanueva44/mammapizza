import { sequelize } from '../database/database.js';

export const getProductosPorCategoria = async () => {
    return await sequelize.query(`
        SELECT 
            c.nombre as categoria, 
            COUNT(p.id) as cantidad
        FROM categorias c
        LEFT JOIN productos p ON c.id = p.categoria_id AND p.estado = true
        WHERE c.estado = true
        GROUP BY c.id, c.nombre
        ORDER BY cantidad DESC
    `, { type: sequelize.QueryTypes.SELECT });
};

export const getStockPorCategoria = async () => {
    return await sequelize.query(`
        SELECT 
            c.nombre as categoria, 
            COALESCE(SUM(p.stock), 0) as stock
        FROM categorias c
        LEFT JOIN productos p ON c.id = p.categoria_id AND p.estado = true
        WHERE c.estado = true
        GROUP BY c.id, c.nombre
        HAVING COALESCE(SUM(p.stock), 0) > 0
        ORDER BY stock DESC
    `, { type: sequelize.QueryTypes.SELECT });
};

export const getPreciosPromedio = async () => {
    return await sequelize.query(`
        SELECT 
            c.nombre as categoria, 
            ROUND(AVG(p.precio), 2) as precio_promedio
        FROM categorias c
        INNER JOIN productos p ON c.id = p.categoria_id 
        WHERE c.estado = true 
            AND p.estado = true 
            AND p.precio IS NOT NULL 
            AND p.precio > 0
        GROUP BY c.id, c.nombre
        ORDER BY precio_promedio DESC
    `, { type: sequelize.QueryTypes.SELECT });
};
