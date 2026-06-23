import { Router } from 'express';
import {
  getMaterialMasters,
  createMaterialMaster,
  getMaterialMasterById,
  updateMaterialMaster,
  deleteMaterialMaster
} from '../controllers/materialMasterController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.use(requireAuth);

router.get('/', getMaterialMasters);
router.post('/', createMaterialMaster);
router.get('/:id', getMaterialMasterById);
router.patch('/:id', updateMaterialMaster);
router.delete('/:id', deleteMaterialMaster);

export default router;
