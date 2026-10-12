import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
  userName: { type: String, required: true },
  userAvatar: { type: String, default: '' },
  restaurantName: { type: String, default: '' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  foodRating: { type: Number, min: 1, max: 5 },
  deliveryRating: { type: Number, min: 1, max: 5 },
  review: { type: String, required: true, trim: true },
  isReported: { type: Boolean, default: false }
}, {
  timestamps: true
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
