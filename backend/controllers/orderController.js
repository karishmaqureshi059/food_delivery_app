import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import Notification from '../models/Notification.js';
import Review from '../models/Review.js';
import DeliveryPartner from '../models/DeliveryPartner.js';

// Helper to generate readable Order Number
const generateOrderNumber = () => {
  return `FD-${Math.floor(100000 + Math.random() * 900000)}`;
};

// @desc Create new order
// @route POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const {
      restaurantId,
      items,
      deliveryAddress,
      paymentMethod,
      subtotal,
      deliveryFee,
      tax,
      discount,
      total,
      couponCode,
      specialInstructions
    } = req.body;

    if (!restaurantId || !items || items.length === 0 || !deliveryAddress || !paymentMethod) {
      return res.status(400).json({ success: false, message: 'Please provide all order details' });
    }

    const orderNumber = generateOrderNumber();
    const initialTimeline = [
      {
        status: 'New Order',
        timestamp: new Date(),
        note: 'Order placed successfully by customer'
      }
    ];

    // Pick an available online delivery partner automatically
    const availablePartner = await DeliveryPartner.findOne({ status: 'online' });

    const order = await Order.create({
      orderNumber,
      userId: req.user._id,
      restaurantId,
      items,
      deliveryAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      orderStatus: 'New Order',
      subtotal,
      deliveryFee: deliveryFee || 0,
      tax: tax || 0,
      discount: discount || 0,
      total,
      couponCode: couponCode || null,
      deliveryPartnerId: availablePartner ? availablePartner._id : null,
      specialInstructions: specialInstructions || '',
      trackingTimeline: initialTimeline
    });

    // Create payment entry
    const transactionId = `TXN-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    await Payment.create({
      transactionId,
      orderId: order._id,
      userId: req.user._id,
      amount: total,
      method: paymentMethod,
      status: paymentMethod === 'cod' ? 'pending' : 'success'
    });

    // Create confirmation notification
    await Notification.create({
      userId: req.user._id,
      title: 'Order Placed! 🍔',
      message: `Your order #${orderNumber} has been received and sent to the restaurant.`,
      type: 'order',
      data: { orderId: order._id }
    });

    res.status(201).json({
      success: true,
      order,
      transactionId
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get logged in user's orders
// @route GET /api/orders/my-orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('restaurantId', 'name image address phone')
      .populate('deliveryPartnerId', 'name phone vehicle rating avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get single order by ID
// @route GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('restaurantId', 'name image address phone rating')
      .populate('deliveryPartnerId', 'name phone vehicle licensePlate rating avatar')
      .populate('userId', 'name email phone');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Verify ownership if not admin
    if (req.user.role !== 'admin' && order.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Cancel order
// @route PUT /api/orders/:id/cancel
export const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (req.user.role !== 'admin' && order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this order' });
    }

    if (['Delivered', 'Cancelled', 'Out for Delivery'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled in state: ${order.orderStatus}`
      });
    }

    order.orderStatus = 'Cancelled';
    order.cancellationReason = reason || 'Cancelled by user';
    order.trackingTimeline.push({
      status: 'Cancelled',
      timestamp: new Date(),
      note: `Order cancelled. Reason: ${order.cancellationReason}`
    });

    await order.save();

    // If paid via online method, mark payment refunded
    if (order.paymentStatus === 'paid') {
      await Payment.findOneAndUpdate(
        { orderId: order._id },
        { status: 'refunded', refundAmount: order.total, refundReason: 'Order cancelled' }
      );
    }

    res.json({ success: true, message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Rate and review delivered order
// @route POST /api/orders/:id/rate
export const rateOrder = async (req, res) => {
  try {
    const { restaurantRating, foodRating, deliveryRating, review } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    order.ratings = {
      restaurant: restaurantRating,
      food: foodRating,
      delivery: deliveryRating,
      review: review || '',
      ratedAt: new Date()
    };
    await order.save();

    // Also create Review record if comment or rating provided
    if (review || restaurantRating) {
      await Review.create({
        userId: req.user._id,
        orderId: order._id,
        restaurantId: order.restaurantId,
        userName: req.user.name,
        userAvatar: req.user.avatar,
        rating: restaurantRating || 5,
        foodRating: foodRating || 5,
        deliveryRating: deliveryRating || 5,
        review: review || 'Order rating submitted by customer'
      });
    }

    res.json({ success: true, message: 'Thank you for your rating!', ratings: order.ratings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== ADMIN ENDPOINTS ====================

// @desc Admin: Get all orders with filter
// @route GET /api/orders
export const getAllOrders = async (req, res) => {
  try {
    const { status, search, date } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.orderStatus = status;
    }

    if (search) {
      query.orderNumber = { $regex: search, $options: 'i' };
    }

    const orders = await Order.find(query)
      .populate('userId', 'name email phone')
      .populate('restaurantId', 'name image address')
      .populate('deliveryPartnerId', 'name phone vehicle')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: Update order status (Status progression)
// @route PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const validStatuses = [
      'New Order',
      'Confirmed',
      'Preparing',
      'Ready for Pickup',
      'Out for Delivery',
      'Delivered',
      'Cancelled'
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status: ${status}` });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.orderStatus = status;
    order.trackingTimeline.push({
      status,
      timestamp: new Date(),
      note: note || `Status updated to ${status}`
    });

    if (status === 'Delivered') {
      order.paymentStatus = 'paid';
    }

    await order.save();

    // Send push notification to customer
    await Notification.create({
      userId: order.userId,
      title: `Order Update: ${status}`,
      message: `Your order #${order.orderNumber} is now ${status}.`,
      type: 'order',
      data: { orderId: order._id, status }
    });

    res.json({ success: true, message: `Order status updated to ${status}`, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: Assign delivery partner
// @route PUT /api/orders/:id/assign-partner
export const assignDeliveryPartner = async (req, res) => {
  try {
    const { partnerId } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.deliveryPartnerId = partnerId;
    await order.save();

    const partner = await DeliveryPartner.findById(partnerId);
    if (partner) {
      partner.currentOrderId = order._id;
      await partner.save();
    }

    res.json({ success: true, message: 'Delivery partner assigned successfully', order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
