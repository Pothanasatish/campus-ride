const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    college: {
      type: String,
      required: [true, 'College name is required'],
      trim: true,
      index: true,
    },
    source: {
      type: String,
      required: [true, 'Commute source location is required'],
      trim: true,
      index: true,
    },
    destination: {
      type: String,
      required: [true, 'Destination campus/location is required'],
      trim: true,
      index: true,
    },
    pickupPoints: [
      {
        type: String,
        trim: true,
      },
    ],
    departureTime: {
      type: String,
      required: [true, 'Departure time is required (e.g. 08:00 AM)'],
    },
    returnTime: {
      type: String,
      default: '',
    },
    recurringDays: [
      {
        type: String,
        enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        required: true,
      },
    ],
    availableSeats: {
      type: Number,
      required: [true, 'Available seat count is required'],
      min: [0, 'Available seats cannot be negative'],
    },
    totalSeats: {
      type: Number,
      required: [true, 'Total seat count is required'],
      min: [1, 'Total seats must be at least 1'],
    },
    vehicleType: {
      type: String,
      enum: ['Bike', 'Car', 'Scooter'],
      required: [true, 'Vehicle type is required'],
    },
    vehicleModel: {
      type: String,
      default: '',
    },
    vehicleNumber: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'full', 'scheduled', 'completed', 'cancelled'],
      default: 'active',
      index: true,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for optimized matching queries
rideSchema.index({ college: 1, source: 1, destination: 1, status: 1 });

module.exports = mongoose.model('Ride', rideSchema);
