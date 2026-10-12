import mongoose from 'mongoose';

const customizationOptionSchema = new mongoose.Schema({
  label: { type: String, required: true },
  price: { type: Number, default: 0 }
});

const customizationGroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  options: [customizationOptionSchema]
});

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, default: '' },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  category: { type: String, required: true },
  isVeg: { type: Boolean, default: true },
  isAvailable: { type: Boolean, default: true },
  isPopular: { type: Boolean, default: false },
  customization: [customizationGroupSchema]
}, {
  timestamps: true
});

const Food = mongoose.model('Food', foodSchema);
export default Food;
