import { Router } from 'express';
import {
  getSiteActivities,
  createSiteActivity,
  getSiteActivityById,
  updateSiteActivity,
  deleteSiteActivity
} from '../controllers/siteActivityController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.use(requireAuth);

router.get('/', getSiteActivities);
router.post('/', createSiteActivity);
router.get('/:id', getSiteActivityById);
router.patch('/:id', updateSiteActivity);
router.delete('/:id', deleteSiteActivity);

export default router;
