const mongoose = require('mongoose');
const Review = require('../models/Review');
const Ride = require('../models/Ride');
const User = require('../models/User');

const inMemoryReviews = [];

const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Submit rating & review for completed ride participant
// @route   POST /api/reviews
// @access  Protected
const createReview = async (req, res) => {
  try {
    const { reviewedUserId, rideId, rating, comment } = req.body;

    if (!reviewedUserId || !rideId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Reviewed user, ride ID, and rating score (1-5) are required.',
      });
    }

    if (isDbConnected()) {
      const review = await Review.create({
        reviewer: req.user.id || req.user._id,
        reviewedUser: reviewedUserId,
        ride: rideId,
        rating: Number(rating),
        comment: comment || '',
      });
      return res.status(201).json({ success: true, data: review });
    } else {
      const review = {
        _id: 'rev_mem_' + Date.now(),
        reviewer: req.user,
        reviewedUser: reviewedUserId,
        ride: rideId,
        rating: Number(rating),
        comment: comment || '',
        createdAt: new Date().toISOString(),
      };
      inMemoryReviews.push(review);
      return res.status(201).json({ success: true, data: review });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get reviews received by a specific user profile
// @route   GET /api/reviews/user/:userId
// @access  Protected
const getUserReviews = async (req, res) => {
  try {
    if (isDbConnected()) {
      const reviews = await Review.find({ reviewedUser: req.params.userId })
        .populate('reviewer', 'name college avatarUrl branch year')
        .sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: reviews });
    } else {
      const userReviews = inMemoryReviews.filter(
        (r) => (r.reviewedUser?._id || r.reviewedUser).toString() === req.params.userId
      );
      return res.status(200).json({ success: true, data: userReviews });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createReview,
  getUserReviews,
  inMemoryReviews,
};
