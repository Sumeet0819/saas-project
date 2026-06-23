import { Router } from 'express';
import {
  getEquipments,
  createEquipment,
  getEquipmentById,
  updateEquipment,
  deleteEquipment
} from '../controllers/equipmentController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.use(requireAuth);

router.get('/', getEquipments);
router.post('/', createEquipment);
router.get('/:id', getEquipmentById);
router.patch('/:id', updateEquipment);
router.delete('/:id', deleteEquipment);

export default router;
