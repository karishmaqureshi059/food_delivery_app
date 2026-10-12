import Review from '../models/Review.js';
import Restaurant from '../models/Restaurant.js';

// @desc Get reviews for a restaurant
// @route GET /api/reviews/restaurant/:restaurantId
export const getRestaurantReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ restaurantId: req.params.restaurantId })
      .sort({ createdAt: -1 });

    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Create a review
// @route POST /api/reviews
export const createReview = async (req, res) => {
  try {
    const { restaurantId, orderId, rating, foodRating, deliveryRating, review } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found' });

    const newReview = await Review.create({
      userId: req.user._id,
      orderId,
      restaurantId,
      userName: req.user.name,
      userAvatar: req.user.avatar,
      restaurantName: restaurant.name,
      rating: parseFloat(rating),
      foodRating: foodRating ? parseFloat(foodRating) : parseFloat(rating),
      deliveryRating: deliveryRating ? parseFloat(deliveryRating) : parseFloat(rating),
      review: review || 'Great food!'
    });

    // Update restaurant rating average
    const allReviews = await Review.find({ restaurantId });
    const avgRating = (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1);
    restaurant.rating = parseFloat(avgRating);
    restaurant.reviewCount = allReviews.length;
    await restaurant.save();

    res.status(201).json({ success: true, review: newReview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== ADMIN ENDPOINTS ====================

// @desc Admin: Get all reviews
// @route GET /api/reviews
export const getAllReviews = async (req, res) => {
  try {
    const { search, reportedOnly } = req.query;
    let query = {};

    if (reportedOnly === 'true') {
      query.isReported = true;
    }

    if (search) {
      query.$or = [
        { userName: { $regex: search, $options: 'i' } },
        { restaurantName: { $regex: search, $options: 'i' } },
        { review: { $regex: search, $options: 'i' } }
      ];
    }

    const reviews = await Review.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: Toggle report status on review
// @route PUT /api/reviews/:id/report
export const toggleReportReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    review.isReported = !review.isReported;
    await review.save();

    res.json({
      success: true,
      message: `Review marked as ${review.isReported ? 'Reported/Inappropriate' : 'Clean'}`,
      review
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: Delete review
// @route DELETE /api/reviews/:id
export const deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
