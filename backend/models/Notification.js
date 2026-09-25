const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        'request_received',
        'request_accepted',
        'request_rejected',
        'ride_cancelled',
        'ride_completed',
        'system',
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedRide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ride',
    },
    relatedRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RideRequest',
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
