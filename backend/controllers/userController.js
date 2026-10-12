import User from '../models/User.js';
import Order from '../models/Order.js';
import Restaurant from '../models/Restaurant.js';

// @desc Get user profile
// @route GET /api/users/profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update user profile
// @route PUT /api/users/profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    if (req.body.avatar) user.avatar = req.body.avatar;

    const updatedUser = await user.save();
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar,
        role: updatedUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Add address
// @route POST /api/users/addresses
export const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { label, street, city, state, zip, isDefault } = req.body;

    if (!street || !city || !state || !zip) {
      return res.status(400).json({ success: false, message: 'Street, city, state, and zip are required' });
    }

    if (isDefault || user.addresses.length === 0) {
      user.addresses.forEach(a => a.isDefault = false);
    }

    user.addresses.push({
      label: label || 'Home',
      street,
      city,
      state,
      zip,
      isDefault: isDefault || user.addresses.length === 0
    });

    await user.save();
    res.status(201).json({ success: true, addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Delete address
// @route DELETE /api/users/addresses/:addressId
export const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.addressId);
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Add saved payment method
// @route POST /api/users/payment-methods
export const addPaymentMethod = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { type, label, details } = req.body;

    user.paymentMethods.push({
      type,
      label,
      details,
      isDefault: user.paymentMethods.length === 0
    });

    await user.save();
    res.status(201).json({ success: true, paymentMethods: user.paymentMethods });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Delete saved payment method
// @route DELETE /api/users/payment-methods/:methodId
export const deletePaymentMethod = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.paymentMethods = user.paymentMethods.filter(m => m._id.toString() !== req.params.methodId);
    await user.save();
    res.json({ success: true, paymentMethods: user.paymentMethods });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Toggle restaurant favorite
// @route POST /api/users/favorites/:restaurantId
export const toggleFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const restId = req.params.restaurantId;

    const index = user.favorites.indexOf(restId);
    if (index > -1) {
      user.favorites.splice(index, 1);
    } else {
      user.favorites.push(restId);
    }

    await user.save();
    res.json({ success: true, favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get user favorite restaurants
// @route GET /api/users/favorites
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const restaurants = await Restaurant.find({ _id: { $in: user.favorites } });
    res.json({ success: true, favorites: restaurants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== ADMIN ENDPOINTS ====================

// @desc Admin: Get all users
// @route GET /api/users
export const getAllUsers = async (req, res) => {
  try {
    const { search, role, status } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) query.role = role;
    if (status === 'blocked') query.isBlocked = true;
    if (status === 'active') query.isBlocked = false;

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: Get user by ID with order history
// @route GET /api/users/:id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const orders = await Order.find({ userId: user._id })
      .populate('restaurantId', 'name image address')
      .sort({ createdAt: -1 });

    res.json({ success: true, user, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: Toggle block/unblock user
// @route PUT /api/users/:id/toggle-block
export const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot block administrator accounts' });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      success: true,
      message: `User successfully ${user.isBlocked ? 'blocked' : 'unblocked'}`,
      isBlocked: user.isBlocked
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
