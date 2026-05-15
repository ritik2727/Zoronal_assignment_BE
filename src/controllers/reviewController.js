const Review = require('../models/Review');

// GET /api/reviews/:companyId
const getReviews = async (req, res) => {
  try {
    const { sort = 'date' } = req.query;
    const { companyId } = req.params;

    let sortOption = {};
    if (sort === 'date') sortOption = { createdAt: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'relevance') sortOption = { likes: -1 };

    const reviews = await Review.find({ companyId }).sort(sortOption).lean();

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    res.json({
      count: reviews.length,
      avgRating: parseFloat(avgRating.toFixed(1)),
      reviews,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/reviews
const createReview = async (req, res) => {
  try {
    const { companyId, fullName, subject, reviewText, rating } = req.body;
    const review = new Review({ companyId, fullName, subject, reviewText, rating });
    const saved = await review.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PATCH /api/reviews/:id/like
const likeReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getReviews, createReview, likeReview };
