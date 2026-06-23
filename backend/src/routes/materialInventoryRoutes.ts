import { Router } from 'express';
import {
  getMaterialInventories,
  createMaterialInventory,
  getMaterialInventoryById,
  updateMaterialInventory,
  deleteMaterialInventory
} from '../controllers/materialInventoryController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.use(requireAuth);

router.get('/', getMaterialInventories);
router.post('/', createMaterialInventory);
router.get('/:id', getMaterialInventoryById);
router.patch('/:id', updateMaterialInventory);
router.delete('/:id', deleteMaterialInventory);

export default router;
