import { Router } from 'express';
import { 
    getPromociones, 
    getPromocionById, 
    createPromocion, 
    updatePromocion, 
    deletePromocion 
} from '../controllers/promociones.controller.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

router.get('/', getPromociones);
router.get('/:id', getPromocionById);
router.post('/', upload.single('imagen'), createPromocion);
router.put('/:id', upload.single('imagen'), updatePromocion);
router.delete('/:id', deletePromocion);

export default router;