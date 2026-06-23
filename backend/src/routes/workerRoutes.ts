import { Router } from 'express';
import { requireAuth, authorizeRoles } from '../middlewares/auth';
import { getWorkers, createWorker, getWorkerById, updateWorker, deleteWorker } from '../controllers/workerController';

const router = Router();

// Apply auth middleware and RBAC
router.use(requireAuth);
router.use(authorizeRoles('Admin', 'Project Manager', 'Contractor'));

router.get('/', getWorkers);
router.post('/', createWorker);
router.get('/:id', getWorkerById);
router.patch('/:id', updateWorker);
router.delete('/:id', deleteWorker);

export default router;
