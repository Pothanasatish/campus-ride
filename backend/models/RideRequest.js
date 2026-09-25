const mongoose = require('mongoose');

const rideRequestSchema = new mongoose.Schema(
  {
    ride: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ride',
      required: true,
      index: true,
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    seatsRequested: {
      type: Number,
      default: 1,
      min: 1,
    },
    message: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'cancelled'],
      default: 'pending',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to quickly locate specific user-ride requests
rideRequestSchema.index({ ride: 1, requester: 1 });

module.exports = mongoose.model('RideRequest', rideRequestSchema);
