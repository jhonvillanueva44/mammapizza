import { getProductStatsService } from '../services/estadisticas.service.js';

export const getProductStatsController = async (req, res) => {
    try {
        const data = await getProductStatsService();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
