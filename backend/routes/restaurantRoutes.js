import express from 'express';
import {
  getAllRestaurants,
  getRestaurantById,
  getAdminRestaurants,
  createRestaurant,
  updateRestaurant,
  toggleRestaurantStatus,
  toggleApproval,
  deleteRestaurant
} from '../controllers/restaurantController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public
router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);

// Admin
router.get('/admin/all', protect, adminOnly, getAdminRestaurants);
router.post('/', protect, adminOnly, createRestaurant);
router.put('/:id', protect, adminOnly, updateRestaurant);
router.put('/:id/toggle-status', protect, adminOnly, toggleRestaurantStatus);
router.put('/:id/approval', protect, adminOnly, toggleApproval);
router.delete('/:id', protect, adminOnly, deleteRestaurant);

export default router;
