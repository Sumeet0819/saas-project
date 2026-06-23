import { Router } from 'express';
import {
  getDeliveries,
  createDelivery,
  getDeliveryById,
  updateDelivery,
  deleteDelivery
} from '../controllers/deliveryController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.use(requireAuth);

router.get('/', getDeliveries);
router.post('/', createDelivery);
router.get('/:id', getDeliveryById);
router.patch('/:id', updateDelivery);
router.delete('/:id', deleteDelivery);

export default router;
