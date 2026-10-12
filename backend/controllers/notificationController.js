import Notification from '../models/Notification.js';

// @desc Get user notifications (personal + broadcast)
// @route GET /api/notifications
export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [
        { userId: req.user._id },
        { userId: null }
      ]
    }).sort({ createdAt: -1 }).limit(30);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    res.json({ success: true, count: notifications.length, unreadCount, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Mark single notification as read
// @route PUT /api/notifications/:id/read
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });

    notification.isRead = true;
    await notification.save();

    res.json({ success: true, message: 'Marked as read', notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Mark all user notifications as read
// @route PUT /api/notifications/read-all
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { $or: [{ userId: req.user._id }, { userId: null }] },
      { isRead: true }
    );
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== ADMIN ENDPOINTS ====================

// @desc Admin: Get all notifications
// @route GET /api/notifications/admin/all
export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: notifications.length, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: Send/Broadcast notification
// @route POST /api/notifications
export const sendNotification = async (req, res) => {
  try {
    const { title, message, type, userId } = req.body;

    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Title and message are required' });
    }

    const notification = await Notification.create({
      userId: userId || null, // null for all users
      title,
      message,
      type: type || 'system',
      isRead: false
    });

    res.status(201).json({
      success: true,
      message: userId ? 'Notification sent to user' : 'Broadcast notification sent to all users',
      notification
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
