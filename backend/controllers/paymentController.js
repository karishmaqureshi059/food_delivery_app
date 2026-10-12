import Payment from '../models/Payment.js';
import Order from '../models/Order.js';

// @desc Process mock payment
// @route POST /api/payments/process
export const processMockPayment = async (req, res) => {
  try {
    const { orderId, amount, method, cardDetails, upiId, shouldSimulateFail } = req.body;

    if (shouldSimulateFail) {
      return res.status(402).json({
        success: false,
        message: 'Payment declined: Insufficient funds or invalid security code. Please try another method.'
      });
    }

    const transactionId = `TXN-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    let cardLast4 = null;
    if (method === 'card' && cardDetails?.number) {
      cardLast4 = cardDetails.number.replace(/\s+/g, '').slice(-4);
    }

    const payment = await Payment.create({
      transactionId,
      orderId,
      userId: req.user._id,
      amount: parseFloat(amount),
      method,
      status: 'success',
      cardLast4,
      upiId: upiId || null
    });

    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'paid'
      });
    }

    res.json({
      success: true,
      message: 'Payment processed successfully',
      transactionId,
      payment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== ADMIN ENDPOINTS ====================

// @desc Admin: Get all transactions
// @route GET /api/payments
export const getAllPayments = async (req, res) => {
  try {
    const { status, method, search } = req.query;
    let query = {};

    if (status) query.status = status;
    if (method) query.method = method;
    if (search) query.transactionId = { $regex: search, $options: 'i' };

    const payments = await Payment.find(query)
      .populate('userId', 'name email phone')
      .populate('orderId', 'orderNumber total')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: payments.length, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: Issue refund
// @route POST /api/payments/:id/refund
export const processRefund = async (req, res) => {
  try {
    const { reason, refundAmount } = req.body;
    const payment = await Payment.findById(req.params.id);

    if (!payment) return res.status(404).json({ success: false, message: 'Transaction not found' });
    if (payment.status === 'refunded') {
      return res.status(400).json({ success: false, message: 'Transaction has already been refunded' });
    }

    payment.status = 'refunded';
    payment.refundAmount = refundAmount ? parseFloat(refundAmount) : payment.amount;
    payment.refundReason = reason || 'Admin initiated refund';
    await payment.save();

    if (payment.orderId) {
      await Order.findByIdAndUpdate(payment.orderId, { paymentStatus: 'refunded' });
    }

    res.json({ success: true, message: 'Refund processed successfully', payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
