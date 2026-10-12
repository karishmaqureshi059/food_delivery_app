import express from 'express';
import { processMockPayment, getAllPayments, processRefund } from '../controllers/paymentController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/process', protect, processMockPayment);
router.get('/', protect, adminOnly, getAllPayments);
router.post('/:id/refund', protect, adminOnly, processRefund);

export default router;
