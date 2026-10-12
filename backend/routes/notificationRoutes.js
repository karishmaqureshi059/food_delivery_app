import express from 'express';
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  getAllNotifications,
  sendNotification
} from '../controllers/notificationController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// User
router.get('/', protect, getMyNotifications);
router.put('/read-all', protect, markAllAsRead);
router.put('/:id/read', protect, markAsRead);

// Admin
router.get('/admin/all', protect, adminOnly, getAllNotifications);
router.post('/', protect, adminOnly, sendNotification);

export default router;
