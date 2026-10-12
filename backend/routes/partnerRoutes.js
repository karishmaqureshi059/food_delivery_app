import express from 'express';
import {
  getAllPartners,
  createPartner,
  togglePartnerStatus,
  deletePartner
} from '../controllers/partnerController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, adminOnly, getAllPartners);
router.post('/', protect, adminOnly, createPartner);
router.put('/:id/toggle-status', protect, adminOnly, togglePartnerStatus);
router.delete('/:id', protect, adminOnly, deletePartner);

export default router;
