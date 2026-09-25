const Ride = require('../models/Ride');
const RideRequest = require('../models/RideRequest');
const Notification = require('../models/Notification');
const { calculateMatchScore } = require('../utils/matchingAlgorithm');

// @desc    Create a new recurring commute ride
// @route   POST /api/rides
// @access  Protected
const createRide = async (req, res) => {
  try {
    const {
      source,
      destination,
      pickupPoints,
      departureTime,
      returnTime,
      recurringDays,
      availableSeats,
      totalSeats,
      vehicleType,
      vehicleModel,
      vehicleNumber,
      notes,
    } = req.body;

    if (!source || !destination || !departureTime || !recurringDays || !availableSeats || !vehicleType) {
      return res.status(400).json({
        success: false,
        message: 'Source, destination, departure time, days, seats, and vehicle type are required.',
      });
    }

    if (source.trim().toLowerCase() === destination.trim().toLowerCase()) {
      return res.status(400).json({
        success: false,
        message: 'Source and destination locations cannot be identical.',
      });
    }

    const formattedPickups = Array.isArray(pickupPoints)
      ? pickupPoints
      : pickupPoints
      ? pickupPoints.split(',').map((s) => s.trim())
      : [];

    const ride = await Ride.create({
      driver: req.user._id,
      college: req.user.college,
      source: source.trim(),
      destination: destination.trim(),
      pickupPoints: formattedPickups,
      departureTime,
      returnTime: returnTime || '',
      recurringDays,
      availableSeats: Number(availableSeats),
      totalSeats: Number(totalSeats || availableSeats),
      vehicleType,
      vehicleModel: vehicleModel || '',
      vehicleNumber: vehicleNumber || '',
      notes: notes || '',
      status: 'active',
    });

    const populatedRide = await Ride.findById(ride._id).populate(
      'driver',
      'name email college branch year rating totalRatings phone avatarUrl'
    );

    res.status(201).json({
      success: true,
      data: populatedRide,
    });
  } catch (error) {
    console.error('[CreateRide Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get/Search active rides with deterministic match scoring
// @route   GET /api/rides
// @access  Protected
const getRides = async (req, res) => {
  try {
    const { source, destination, departureTime, days, vehicleType, myRidesOnly } = req.query;

    let filter = { status: { $in: ['active', 'full'] } };

    if (myRidesOnly === 'true') {
      delete filter.status;
      filter.driver = req.user._id;
    } else {
      filter.college = req.user.college;
      filter.driver = { $ne: req.user._id };
    }

    if (vehicleType) {
      filter.vehicleType = vehicleType;
    }

    const rides = await Ride.find(filter)
      .populate('driver', 'name email college branch year rating totalRatings phone avatarUrl')
      .sort({ createdAt: -1 });

    const queryParams = {
      college: req.user.college,
      source: source || '',
      destination: destination || '',
      departureTime: departureTime || '',
      recurringDays: days ? days.split(',') : [],
    };

    const rankedRides = rides.map((ride) => {
      const rideObj = ride.toObject();
      const matchResult = calculateMatchScore(queryParams, rideObj);
      return {
        ...rideObj,
        matchScore: matchResult.score,
        matchBadge: matchResult.badge,
      };
    });

    if (source || destination || departureTime || days) {
      rankedRides.sort((a, b) => b.matchScore - a.matchScore);
    }

    res.status(200).json({
      success: true,
      count: rankedRides.length,
      data: rankedRides,
    });
  } catch (error) {
    console.error('[GetRides Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single ride by ID
// @route   GET /api/rides/:id
// @access  Protected
const getRideById = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate(
      'driver',
      'name email college branch year rating totalRatings phone avatarUrl bio'
    );

    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found.' });
    }

    const requests = await RideRequest.find({ ride: ride._id }).populate(
      'requester',
      'name email college branch year rating phone avatarUrl'
    );

    res.status(200).json({
      success: true,
      data: {
        ride,
        requests,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update ride details
// @route   PUT /api/rides/:id
// @access  Protected (Driver Only)
const updateRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found.' });
    }

    if (ride.driver.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this ride.' });
    }

    const updated = await Ride.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('driver', 'name email college branch year rating phone');

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update ride status (active, scheduled, completed, cancelled)
// @route   PATCH /api/rides/:id/status
// @access  Protected (Driver Only)
const updateRideStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found.' });
    }

    if (ride.driver.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update ride status.' });
    }

    ride.status = status;
    await ride.save();

    if (status === 'cancelled') {
      const requests = await RideRequest.find({ ride: ride._id, status: { $in: ['pending', 'accepted'] } });
      for (const reqItem of requests) {
        reqItem.status = 'cancelled';
        await reqItem.save();

        await Notification.create({
          recipient: reqItem.requester,
          type: 'ride_cancelled',
          title: 'Ride Cancelled',
          message: `The ride from ${ride.source} to ${ride.destination} has been cancelled by the provider.`,
          relatedRide: ride._id,
        });
      }
    }

    if (status === 'completed') {
      const acceptedRequests = await RideRequest.find({ ride: ride._id, status: 'accepted' });
      for (const reqItem of acceptedRequests) {
        await Notification.create({
          recipient: reqItem.requester,
          type: 'ride_completed',
          title: 'Ride Completed',
          message: `Your ride from ${ride.source} to ${ride.destination} is marked completed! Rate your experience.`,
          relatedRide: ride._id,
        });
      }
    }

    res.status(200).json({
      success: true,
      data: ride,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete/Cancel ride
// @route   DELETE /api/rides/:id
// @access  Protected (Driver Only)
const deleteRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found.' });
    }

    if (ride.driver.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this ride.' });
    }

    ride.status = 'cancelled';
    await ride.save();

    res.status(200).json({
      success: true,
      message: 'Ride cancelled successfully.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createRide,
  getRides,
  getRideById,
  updateRide,
  updateRideStatus,
  deleteRide,
};
