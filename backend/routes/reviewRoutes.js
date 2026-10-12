import express from 'express';
import {
  getRestaurantReviews,
  createReview,
  getAllReviews,
  toggleReportReview,
  deleteReview
} from '../controllers/reviewController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/restaurant/:restaurantId', getRestaurantReviews);
router.post('/', protect, createReview);

// Admin
router.get('/', protect, adminOnly, getAllReviews);
router.put('/:id/report', protect, adminOnly, toggleReportReview);
router.delete('/:id', protect, adminOnly, deleteReview);

export default router;
