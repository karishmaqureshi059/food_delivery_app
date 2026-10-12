import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['upi', 'card', 'cod'], required: true },
  status: { type: String, enum: ['success', 'pending', 'failed', 'refunded'], default: 'pending' },
  failureReason: { type: String, default: null },
  cardLast4: { type: String, default: null },
  upiId: { type: String, default: null },
  refundAmount: { type: Number, default: 0 },
  refundReason: { type: String, default: null }
}, {
  timestamps: true
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
