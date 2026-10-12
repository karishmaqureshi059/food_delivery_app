import express from 'express';
import {
  getAllFoods,
  getFoodById,
  createFood,
  updateFood,
  toggleFoodAvailability,
  deleteFood
} from '../controllers/foodController.js';
import { protect, adminOnly } from '../middleware/auth.js';

import { syncINRAndDesserts } from '../utils/seed.js';

const router = express.Router();

router.get('/', getAllFoods);
router.get('/:id', getFoodById);
router.post('/sync-inr-desserts', async (req, res) => {
  try {
    await syncINRAndDesserts();
    res.json({ success: true, message: 'Database updated with INR prices and Desserts dishes' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin
router.post('/', protect, adminOnly, createFood);
router.put('/:id', protect, adminOnly, updateFood);
router.put('/:id/toggle-stock', protect, adminOnly, toggleFoodAvailability);
router.delete('/:id', protect, adminOnly, deleteFood);

export default router;
