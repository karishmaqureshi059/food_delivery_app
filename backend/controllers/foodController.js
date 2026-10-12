import Food from '../models/Food.js';

// @desc Get foods with search/filter
// @route GET /api/food
export const getAllFoods = async (req, res) => {
  try {
    const { search, restaurantId, category, isVeg, isPopular } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (restaurantId) query.restaurantId = restaurantId;
    if (category) query.category = new RegExp(category, 'i');
    if (isVeg !== undefined) query.isVeg = isVeg === 'true';
    if (isPopular !== undefined) query.isPopular = isPopular === 'true';

    const foods = await Food.find(query).populate('restaurantId', 'name address image deliveryTime rating');
    res.json({ success: true, count: foods.length, foods });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get food by ID
// @route GET /api/food/:id
export const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).populate('restaurantId', 'name address deliveryFee minOrder rating');
    if (!food) return res.status(404).json({ success: false, message: 'Dish not found' });
    res.json({ success: true, food });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== ADMIN ENDPOINTS ====================

// @desc Admin: Create food item
// @route POST /api/food
export const createFood = async (req, res) => {
  try {
    const { name, description, price, image, restaurantId, category, isVeg, customization } = req.body;

    if (!name || !price || !restaurantId || !category) {
      return res.status(400).json({ success: false, message: 'Please provide name, price, restaurantId, and category' });
    }

    const food = await Food.create({
      name,
      description: description || '',
      price: parseFloat(price),
      image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      restaurantId,
      category,
      isVeg: !!isVeg,
      isAvailable: true,
      customization: customization || []
    });

    res.status(201).json({ success: true, food });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: Update food item
// @route PUT /api/food/:id
export const updateFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ success: false, message: 'Food item not found' });

    const updated = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, food: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: Toggle in-stock availability
// @route PUT /api/food/:id/toggle-stock
export const toggleFoodAvailability = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ success: false, message: 'Food item not found' });

    food.isAvailable = !food.isAvailable;
    await food.save();

    res.json({
      success: true,
      message: `Item marked as ${food.isAvailable ? 'Available' : 'Out of Stock'}`,
      isAvailable: food.isAvailable
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: Delete food item
// @route DELETE /api/food/:id
export const deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ success: false, message: 'Food item not found' });

    await Food.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Food item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
