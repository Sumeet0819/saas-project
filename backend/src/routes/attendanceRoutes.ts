import { Router } from 'express';
import {
  getAttendances,
  createAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance
} from '../controllers/attendanceController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.use(requireAuth);

router.get('/', getAttendances);
router.post('/', createAttendance);
router.get('/:id', getAttendanceById);
router.patch('/:id', updateAttendance);
router.delete('/:id', deleteAttendance);

export default router;
