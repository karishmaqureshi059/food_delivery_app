import Restaurant from '../models/Restaurant.js';
import Food from '../models/Food.js';

// @desc Get all restaurants with filter, search, sort
// @route GET /api/restaurants
export const getAllRestaurants = async (req, res) => {
  try {
    const { search, category, cuisine, rating, priceRange, vegOnly, sort } = req.query;

    let query = { isActive: true, isApproved: true };

    // Search by name, cuisine, address
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { cuisine: { $in: [new RegExp(search, 'i')] } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.categories = { $in: [new RegExp(category, 'i')] };
    }

    if (cuisine) {
      query.cuisine = { $in: [new RegExp(cuisine, 'i')] };
    }

    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }

    if (priceRange) {
      const mapped = priceRange.includes('₹')
        ? [priceRange, priceRange.replace(/₹/g, '$')]
        : [priceRange, priceRange.replace(/\$/g, '₹')];
      query.priceRange = { $in: mapped };
    }

    if (vegOnly === 'true') {
      query.isVegOnly = true;
    }

    let sortOption = { rating: -1 };
    if (sort === 'popularity') {
      sortOption = { reviewCount: -1 };
    } else if (sort === 'rating') {
      sortOption = { rating: -1 };
    } else if (sort === 'deliveryTime') {
      sortOption = { deliveryTime: 1 };
    } else if (sort === 'name') {
      sortOption = { name: 1 };
    }

    const restaurants = await Restaurant.find(query).sort(sortOption);
    res.json({ success: true, count: restaurants.length, restaurants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get single restaurant with its menu foods
// @route GET /api/restaurants/:id
export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    const foods = await Food.find({ restaurantId: restaurant._id, isAvailable: true });

    // Group foods by category
    const menuByCategory = {};
    foods.forEach(food => {
      if (!menuByCategory[food.category]) {
        menuByCategory[food.category] = [];
      }
      menuByCategory[food.category].push(food);
    });

    res.json({
      success: true,
      restaurant,
      foods,
      menuByCategory
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== ADMIN ENDPOINTS ====================

// @desc Admin: Get all restaurants (including inactive and pending)
// @route GET /api/restaurants/admin/all
export const getAdminRestaurants = async (req, res) => {
  try {
    const { search, status, approval } = req.query;
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (status) {
      query.isActive = status === 'active';
    }
    if (approval) {
      query.isApproved = approval === 'approved';
    }

    const restaurants = await Restaurant.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: restaurants.length, restaurants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: Create restaurant
// @route POST /api/restaurants
export const createRestaurant = async (req, res) => {
  try {
    const {
      name,
      description,
      cuisine,
      image,
      coverImage,
      address,
      phone,
      deliveryTime,
      deliveryFee,
      minOrder,
      priceRange,
      categories,
      isVegOnly
    } = req.body;

    if (!name || !address) {
      return res.status(400).json({ success: false, message: 'Restaurant name and address are required' });
    }

    const restaurant = await Restaurant.create({
      name,
      description,
      cuisine: Array.isArray(cuisine) ? cuisine : (cuisine ? cuisine.split(',').map(c => c.trim()) : ['Multicuisine']),
      image: image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500',
      coverImage: coverImage || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000',
      address,
      phone,
      deliveryTime: deliveryTime || '25-35 min',
      deliveryFee: deliveryFee !== undefined ? parseFloat(deliveryFee) : 2.99,
      minOrder: minOrder !== undefined ? parseFloat(minOrder) : 10,
      priceRange: priceRange || '$$',
      categories: Array.isArray(categories) ? categories : (categories ? categories.split(',').map(c => c.trim()) : ['Main Course']),
      isVegOnly: !!isVegOnly,
      isOpen: true,
      isActive: true,
      isApproved: true
    });

    res.status(201).json({ success: true, restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: Update restaurant
// @route PUT /api/restaurants/:id
export const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    if (req.body.cuisine && !Array.isArray(req.body.cuisine)) {
      req.body.cuisine = req.body.cuisine.split(',').map(c => c.trim());
    }
    if (req.body.categories && !Array.isArray(req.body.categories)) {
      req.body.categories = req.body.categories.split(',').map(c => c.trim());
    }

    const updated = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, restaurant: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: Toggle active/inactive
// @route PUT /api/restaurants/:id/toggle-status
export const toggleRestaurantStatus = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found' });

    restaurant.isActive = !restaurant.isActive;
    await restaurant.save();

    res.json({
      success: true,
      message: `Restaurant marked as ${restaurant.isActive ? 'Active' : 'Inactive'}`,
      isActive: restaurant.isActive
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: Approve / Reject restaurant
// @route PUT /api/restaurants/:id/approval
export const toggleApproval = async (req, res) => {
  try {
    const { approved } = req.body;
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found' });

    restaurant.isApproved = approved !== undefined ? approved : !restaurant.isApproved;
    await restaurant.save();

    res.json({
      success: true,
      message: `Restaurant ${restaurant.isApproved ? 'Approved' : 'Rejected'}`,
      isApproved: restaurant.isApproved
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: Delete restaurant
// @route DELETE /api/restaurants/:id
export const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found' });

    await Food.deleteMany({ restaurantId: restaurant._id });
    await Restaurant.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Restaurant and associated menu deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
