import { Router } from 'express';
import { requireAuth, authorizeRoles } from '../middlewares/auth';
import { getProjects, createProject, getProjectById, updateProject, deleteProject } from '../controllers/projectController';

const router = Router();

// Apply auth middleware and RBAC
router.use(requireAuth);
router.use(authorizeRoles('Admin', 'Project Manager'));

router.get('/debug-key', (req, res) => {
  const { supabase } = require('../config/supabase');
  res.json({ 
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    keyEndsWith: supabase['supabaseKey'] ? supabase['supabaseKey'].slice(-5) : 'unknown',
    anonKeyEndsWith: process.env.SUPABASE_ANON_KEY ? process.env.SUPABASE_ANON_KEY.slice(-5) : 'unknown',
    serviceKeyEndsWith: process.env.SUPABASE_SERVICE_ROLE_KEY ? process.env.SUPABASE_SERVICE_ROLE_KEY.slice(-5) : 'unknown'
  });
});

router.get('/', getProjects);
router.post('/', createProject);
router.get('/:id', getProjectById);
router.patch('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
