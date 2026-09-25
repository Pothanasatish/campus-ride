const RideRequest = require('../models/RideRequest');
const Ride = require('../models/Ride');
const Notification = require('../models/Notification');

// @desc    Send a request to join a ride
// @route   POST /api/rides/:id/requests
// @access  Protected
const createRequest = async (req, res) => {
  try {
    const { seatsRequested, message } = req.body;
    const rideId = req.params.id;

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found.' });
    }

    if (ride.driver.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot request a seat in your own ride.' });
    }

    if (ride.status !== 'active') {
      return res.status(400).json({ success: false, message: `This ride is currently ${ride.status} and cannot accept new requests.` });
    }

    const seats = Number(seatsRequested || 1);
    if (seats > ride.availableSeats) {
      return res.status(400).json({
        success: false,
        message: `Only ${ride.availableSeats} seat(s) available for this ride.`,
      });
    }

    const existingReq = await RideRequest.findOne({
      ride: rideId,
      requester: req.user._id,
      status: { $in: ['pending', 'accepted'] },
    });

    if (existingReq) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active request for this ride.',
      });
    }

    const newRequest = await RideRequest.create({
      ride: rideId,
      requester: req.user._id,
      seatsRequested: seats,
      message: message || '',
      status: 'pending',
    });

    await Notification.create({
      recipient: ride.driver,
      type: 'request_received',
      title: 'New Ride Request',
      message: `${req.user.name} requested ${seats} seat(s) for your ride from ${ride.source} to ${ride.destination}.`,
      relatedRide: ride._id,
      relatedRequest: newRequest._id,
    });

    const populated = await RideRequest.findById(newRequest._id)
      .populate('requester', 'name email college branch year rating phone avatarUrl')
      .populate('ride');

    res.status(201).json({
      success: true,
      data: populated,
    });
  } catch (error) {
    console.error('[CreateRequest Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get requests created by logged in student
// @route   GET /api/requests/my-requests
// @access  Protected
const getMyRequests = async (req, res) => {
  try {
    const requests = await RideRequest.find({ requester: req.user._id })
      .populate({
        path: 'ride',
        populate: { path: 'driver', select: 'name email phone rating totalRatings vehicleType vehicleModel vehicleNumber' },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get requests received for rides created by logged in student
// @route   GET /api/requests/incoming
// @access  Protected
const getIncomingRequests = async (req, res) => {
  try {
    const myRides = await Ride.find({ driver: req.user._id }).select('_id');
    const rideIds = myRides.map((r) => r._id);

    const requests = await RideRequest.find({ ride: { $in: rideIds } })
      .populate('requester', 'name email college branch year rating totalRatings phone avatarUrl')
      .populate('ride')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Accept request & reserve seat ATOMICALLY (Prevents Overbooking Race Conditions)
// @route   PUT /api/requests/:id/accept
// @access  Protected (Ride Provider Only)
const acceptRequest = async (req, res) => {
  try {
    const requestItem = await RideRequest.findById(req.params.id).populate('ride');
    if (!requestItem) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    const ride = requestItem.ride;
    if (ride.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to manage requests for this ride.' });
    }

    if (requestItem.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Request is already ${requestItem.status}.` });
    }

    const updatedRide = await Ride.findOneAndUpdate(
      {
        _id: ride._id,
        availableSeats: { $gte: requestItem.seatsRequested },
        status: { $in: ['active', 'full'] },
      },
      {
        $inc: { availableSeats: -requestItem.seatsRequested },
      },
      { new: true }
    );

    if (!updatedRide) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient seats available to accept this request. Overbooking prevented.',
      });
    }

    if (updatedRide.availableSeats === 0) {
      updatedRide.status = 'full';
      await updatedRide.save();
    }

    requestItem.status = 'accepted';
    await requestItem.save();

    await Notification.create({
      recipient: requestItem.requester,
      type: 'request_accepted',
      title: 'Ride Request Accepted!',
      message: `Your request for the commute from ${ride.source} to ${ride.destination} has been accepted.`,
      relatedRide: ride._id,
      relatedRequest: requestItem._id,
    });

    res.status(200).json({
      success: true,
      message: 'Request accepted successfully. Seat reserved.',
      data: {
        request: requestItem,
        ride: updatedRide,
      },
    });
  } catch (error) {
    console.error('[AcceptRequest Concurrency Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject ride request
// @route   PUT /api/requests/:id/reject
// @access  Protected (Ride Provider Only)
const rejectRequest = async (req, res) => {
  try {
    const requestItem = await RideRequest.findById(req.params.id).populate('ride');
    if (!requestItem) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    if (requestItem.ride.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to manage requests for this ride.' });
    }

    requestItem.status = 'rejected';
    await requestItem.save();

    await Notification.create({
      recipient: requestItem.requester,
      type: 'request_rejected',
      title: 'Ride Request Declined',
      message: `Your request for the ride from ${requestItem.ride.source} to ${requestItem.ride.destination} was declined.`,
      relatedRide: requestItem.ride._id,
      relatedRequest: requestItem._id,
    });

    res.status(200).json({
      success: true,
      data: requestItem,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel request & restore available seats if previously accepted
// @route   PUT /api/requests/:id/cancel
// @access  Protected
const cancelRequest = async (req, res) => {
  try {
    const requestItem = await RideRequest.findById(req.params.id).populate('ride');
    if (!requestItem) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    const isRequester = requestItem.requester.toString() === req.user._id.toString();
    const isDriver = requestItem.ride.driver.toString() === req.user._id.toString();

    if (!isRequester && !isDriver && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this request.' });
    }

    const wasAccepted = requestItem.status === 'accepted';
    requestItem.status = 'cancelled';
    await requestItem.save();

    if (wasAccepted) {
      const updatedRide = await Ride.findByIdAndUpdate(
        requestItem.ride._id,
        {
          $inc: { availableSeats: requestItem.seatsRequested },
        },
        { new: true }
      );

      if (updatedRide && updatedRide.status === 'full' && updatedRide.availableSeats > 0) {
        updatedRide.status = 'active';
        await updatedRide.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Request cancelled successfully. Seat count updated.',
      data: requestItem,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createRequest,
  getMyRequests,
  getIncomingRequests,
  acceptRequest,
  rejectRequest,
  cancelRequest,
};
