const express = require('express');
const router = express.Router();
const {
  getStats,
  getUsers,
  toggleUserStatus,
  getReports,
  resolveReport,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.patch('/users/:id/status', toggleUserStatus);
router.get('/reports', getReports);
router.patch('/reports/:id', resolveReport);

module.exports = router;
