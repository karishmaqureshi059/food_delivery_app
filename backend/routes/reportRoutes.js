import express from 'express';
import {
  getDashboardStats,
  getRevenueAnalytics,
  getTabularReports
} from '../controllers/reportController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', protect, adminOnly, getDashboardStats);
router.get('/analytics', protect, adminOnly, getRevenueAnalytics);
router.get('/export', protect, adminOnly, getTabularReports);

export default router;
