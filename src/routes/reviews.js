const express = require('express');
const router = express.Router();
const { getReviews, createReview, likeReview } = require('../controllers/reviewController');

router.get('/:companyId', getReviews);
router.post('/', createReview);
router.patch('/:id/like', likeReview);

module.exports = router;
