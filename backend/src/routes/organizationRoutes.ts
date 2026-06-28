import { Router } from 'express';
import { requireAuth, authorizeRoles } from '../middlewares/auth';
import {
  getOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization
} from '../controllers/organizationController';

const router = Router();

// Organizations can be viewed and created by Admin/Project Manager usually
router.use(requireAuth);
// router.use(authorizeRoles('Admin', 'Project Manager')); // Optional: uncomment if strict RBAC is needed at route level

router.get('/', getOrganizations);
router.get('/:id', getOrganizationById);
router.post('/', createOrganization);
router.put('/:id', updateOrganization);
router.delete('/:id', deleteOrganization);

export default router;
