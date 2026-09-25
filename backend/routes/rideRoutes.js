const express = require('express');
const router = express.Router();
const {
  createRide,
  getRides,
  getRideById,
  updateRide,
  updateRideStatus,
  deleteRide,
} = require('../controllers/rideController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createRide)
  .get(protect, getRides);

router.route('/:id')
  .get(protect, getRideById)
  .put(protect, updateRide)
  .delete(protect, deleteRide);

router.patch('/:id/status', protect, updateRideStatus);

module.exports = router;
