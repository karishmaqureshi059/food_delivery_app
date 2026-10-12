import express from 'express';
import {
  getActiveCoupons,
  validateCoupon,
  getAllCoupons,
  createCoupon,
  toggleCouponStatus,
  deleteCoupon
} from '../controllers/couponController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/active', getActiveCoupons);
router.post('/validate', validateCoupon);

// Admin
router.get('/', protect, adminOnly, getAllCoupons);
router.post('/', protect, adminOnly, createCoupon);
router.put('/:id/toggle-status', protect, adminOnly, toggleCouponStatus);
router.delete('/:id', protect, adminOnly, deleteCoupon);

export default router;
