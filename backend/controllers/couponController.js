import Coupon from '../models/Coupon.js';

// @desc Get active coupons for users
// @route GET /api/coupons/active
export const getActiveCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({
      isActive: true,
      expiryDate: { $gte: new Date() }
    }).select('-__v');

    res.json({ success: true, count: coupons.length, coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Validate coupon code during checkout
// @route POST /api/coupons/validate
export const validateCoupon = async (req, res) => {
  try {
    const { code, orderTotal, deliveryFee } = req.body;

    if (!code) return res.status(400).json({ success: false, message: 'Coupon code is required' });

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid coupon code' });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ success: false, message: 'This coupon is no longer active' });
    }

    if (new Date() > new Date(coupon.expiryDate)) {
      return res.status(400).json({ success: false, message: 'This coupon has expired' });
    }

    if (orderTotal < coupon.minOrder) {
      return res.status(400).json({
        success: false,
        message: `Minimum order value of ₹${coupon.minOrder.toFixed(2)} required for this coupon`
      });
    }

    // Calculate discount amount
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (orderTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else if (coupon.discountType === 'flat') {
      discount = coupon.discountValue;
    } else if (coupon.discountType === 'free_delivery') {
      discount = deliveryFee || 40;
    }

    // Clamp discount
    discount = Math.min(discount, orderTotal);

    res.json({
      success: true,
      message: `Coupon applied! You save $${discount.toFixed(2)}`,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: parseFloat(discount.toFixed(2))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== ADMIN ENDPOINTS ====================

// @desc Admin: Get all coupons
// @route GET /api/coupons
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, count: coupons.length, coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: Create coupon
// @route POST /api/coupons
export const createCoupon = async (req, res) => {
  try {
    const { code, description, discountType, discountValue, minOrder, maxDiscount, expiryDate } = req.body;

    if (!code || !discountType || discountValue === undefined || !expiryDate) {
      return res.status(400).json({ success: false, message: 'Please fill all required coupon fields' });
    }

    const existing = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A coupon with this code already exists' });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase().trim(),
      description: description || '',
      discountType,
      discountValue: parseFloat(discountValue),
      minOrder: minOrder ? parseFloat(minOrder) : 0,
      maxDiscount: maxDiscount ? parseFloat(maxDiscount) : 100,
      expiryDate: new Date(expiryDate),
      isActive: true
    });

    res.status(201).json({ success: true, coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: Toggle coupon active status
// @route PUT /api/coupons/:id/toggle-status
export const toggleCouponStatus = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    res.json({
      success: true,
      message: `Coupon marked as ${coupon.isActive ? 'Active' : 'Inactive'}`,
      coupon
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: Delete coupon
// @route DELETE /api/coupons/:id
export const deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
