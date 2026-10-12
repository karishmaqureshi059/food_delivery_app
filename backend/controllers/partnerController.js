import DeliveryPartner from '../models/DeliveryPartner.js';

// @desc Get all delivery partners
// @route GET /api/delivery-partners
export const getAllPartners = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const partners = await DeliveryPartner.find(query).populate('currentOrderId', 'orderNumber total orderStatus');
    res.json({ success: true, count: partners.length, partners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: Create delivery partner
// @route POST /api/delivery-partners
export const createPartner = async (req, res) => {
  try {
    const { name, phone, email, vehicle, licensePlate } = req.body;

    if (!name || !phone || !email) {
      return res.status(400).json({ success: false, message: 'Name, phone, and email are required' });
    }

    const partner = await DeliveryPartner.create({
      name,
      phone,
      email,
      vehicle: vehicle || 'Motorcycle',
      licensePlate: licensePlate || 'NY-TMP',
      avatar: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200`
    });

    res.status(201).json({ success: true, partner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: Toggle online/offline status
// @route PUT /api/delivery-partners/:id/toggle-status
export const togglePartnerStatus = async (req, res) => {
  try {
    const partner = await DeliveryPartner.findById(req.params.id);
    if (!partner) return res.status(404).json({ success: false, message: 'Partner not found' });

    partner.status = partner.status === 'online' ? 'offline' : 'online';
    await partner.save();

    res.json({ success: true, message: `Status updated to ${partner.status}`, partner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: Delete partner
// @route DELETE /api/delivery-partners/:id
export const deletePartner = async (req, res) => {
  try {
    await DeliveryPartner.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Delivery partner removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
