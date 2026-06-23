import { Router } from 'express';
import {
  getSitePhotos,
  createSitePhoto,
  getSitePhotoById,
  updateSitePhoto,
  deleteSitePhoto
} from '../controllers/sitePhotoController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.use(requireAuth);

router.get('/', getSitePhotos);
router.post('/', createSitePhoto);
router.get('/:id', getSitePhotoById);
router.patch('/:id', updateSitePhoto);
router.delete('/:id', deleteSitePhoto);

export default router;
