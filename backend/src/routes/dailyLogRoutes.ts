import { Router } from 'express';
import { requireAuth, authorizeRoles } from '../middlewares/auth';
import { getDailyLogs, createDailyLog, getDailyLogById, updateDailyLog, deleteDailyLog } from '../controllers/dailyLogController';

const router = Router();

// Apply auth middleware and RBAC
router.use(requireAuth);
router.use(authorizeRoles('Admin', 'Project Manager', 'Site Engineer'));

router.get('/', getDailyLogs);
router.post('/', createDailyLog);
router.get('/:id', getDailyLogById);
router.patch('/:id', updateDailyLog);
router.delete('/:id', deleteDailyLog);

export default router;
