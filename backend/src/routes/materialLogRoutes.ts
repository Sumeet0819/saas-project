import { Router } from 'express';
import { requireAuth, authorizeRoles } from '../middlewares/auth';
import { getMaterialLogs, createMaterialLog, getMaterialLogById, updateMaterialLog, deleteMaterialLog } from '../controllers/materialLogController';

const router = Router();

// Apply auth middleware and RBAC
router.use(requireAuth);
router.use(authorizeRoles('Admin', 'Project Manager', 'Site Engineer', 'Supplier'));

router.get('/', getMaterialLogs);
router.post('/', createMaterialLog);
router.get('/:id', getMaterialLogById);
router.patch('/:id', updateMaterialLog);
router.delete('/:id', deleteMaterialLog);

export default router;
