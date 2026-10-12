import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  cuisine: [{ type: String }],
  image: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  rating: { type: Number, default: 4.5, min: 1, max: 5 },
  reviewCount: { type: Number, default: 0 },
  deliveryTime: { type: String, default: '25-35 min' },
  deliveryFee: { type: Number, default: 40 },
  minOrder: { type: Number, default: 150 },
  priceRange: { type: String, enum: ['$', '$$', '$$$', '₹', '₹₹', '₹₹₹'], default: '₹₹' },
  address: { type: String, required: true },
  phone: { type: String, default: '' },
  openingHours: { type: String, default: '10:00 AM - 11:00 PM' },
  categories: [{ type: String }],
  isOpen: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  isApproved: { type: Boolean, default: true },
  isVegOnly: { type: Boolean, default: false }
}, {
  timestamps: true
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
export default Restaurant;
