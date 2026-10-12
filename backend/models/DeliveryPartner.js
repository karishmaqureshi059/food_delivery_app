import mongoose from 'mongoose';

const deliveryPartnerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  vehicle: { type: String, default: 'Bike' },
  licensePlate: { type: String, default: '' },
  status: { type: String, enum: ['online', 'offline', 'busy'], default: 'online' },
  currentOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
  rating: { type: Number, default: 4.8 },
  totalDeliveries: { type: Number, default: 0 },
  avatar: { type: String, default: '' }
}, {
  timestamps: true
});

const DeliveryPartner = mongoose.model('DeliveryPartner', deliveryPartnerSchema);
export default DeliveryPartner;
