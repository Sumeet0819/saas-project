import { Router } from 'express';
import {
  getMaterialRequests,
  createMaterialRequest,
  getMaterialRequestById,
  updateMaterialRequest,
  deleteMaterialRequest
} from '../controllers/materialRequestController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.use(requireAuth);

router.get('/', getMaterialRequests);
router.post('/', createMaterialRequest);
router.get('/:id', getMaterialRequestById);
router.patch('/:id', updateMaterialRequest);
router.delete('/:id', deleteMaterialRequest);

export default router;
