import { Router } from 'express';
import {
  getSiteIssues,
  createSiteIssue,
  getSiteIssueById,
  updateSiteIssue,
  deleteSiteIssue
} from '../controllers/siteIssueController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.use(requireAuth);

router.get('/', getSiteIssues);
router.post('/', createSiteIssue);
router.get('/:id', getSiteIssueById);
router.patch('/:id', updateSiteIssue);
router.delete('/:id', deleteSiteIssue);

export default router;
