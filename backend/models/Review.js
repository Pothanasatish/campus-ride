const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reviewedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ride: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ride',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating score is required'],
      min: [1, 'Minimum rating is 1 star'],
      max: [5, 'Maximum rating is 5 stars'],
    },
    comment: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Enforce unique review constraint per ride per reviewer-reviewed pair
reviewSchema.index({ ride: 1, reviewer: 1, reviewedUser: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
