import { Router } from 'express';
import {
  getSuppliers,
  createSupplier,
  getSupplierById,
  updateSupplier,
  deleteSupplier
} from '../controllers/supplierController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.use(requireAuth);

router.get('/', getSuppliers);
router.post('/', createSupplier);
router.get('/:id', getSupplierById);
router.patch('/:id', updateSupplier);
router.delete('/:id', deleteSupplier);

export default router;
