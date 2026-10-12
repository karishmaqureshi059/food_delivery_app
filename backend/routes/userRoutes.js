import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  addAddress,
  deleteAddress,
  addPaymentMethod,
  deletePaymentMethod,
  toggleFavorite,
  getFavorites,
  getAllUsers,
  getUserById,
  toggleBlockUser
} from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// User profile endpoints
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/addresses', protect, addAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);
router.post('/payment-methods', protect, addPaymentMethod);
router.delete('/payment-methods/:methodId', protect, deletePaymentMethod);
router.post('/favorites/:restaurantId', protect, toggleFavorite);
router.get('/favorites', protect, getFavorites);

// Admin endpoints
router.get('/', protect, adminOnly, getAllUsers);
router.get('/:id', protect, adminOnly, getUserById);
router.put('/:id/toggle-block', protect, adminOnly, toggleBlockUser);

export default router;
