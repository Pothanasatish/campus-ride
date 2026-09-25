const express = require('express');
const router = express.Router();
const {
  createRequest,
  getMyRequests,
  getIncomingRequests,
  acceptRequest,
  rejectRequest,
  cancelRequest,
} = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

router.post('/ride/:id', protect, createRequest);
router.post('/:id', protect, createRequest);
router.get('/my-requests', protect, getMyRequests);
router.get('/incoming', protect, getIncomingRequests);
router.put('/:id/accept', protect, acceptRequest);
router.put('/:id/reject', protect, rejectRequest);
router.put('/:id/cancel', protect, cancelRequest);

module.exports = router;
