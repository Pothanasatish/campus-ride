const User = require('../models/User');
const Ride = require('../models/Ride');
const RideRequest = require('../models/RideRequest');
const Report = require('../models/Report');

// @desc    Get Platform Statistics & Analytics Metrics
// @route   GET /api/admin/stats
// @access  Protected (Admin Only)
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'student' });
    const activeRides = await Ride.countDocuments({ status: { $in: ['active', 'full'] } });
    const completedRides = await Ride.countDocuments({ status: 'completed' });
    const totalRequests = await RideRequest.countDocuments();
    const acceptedRequests = await RideRequest.countDocuments({ status: 'accepted' });
    const pendingReports = await Report.countDocuments({ status: 'pending' });

    const routeBreakdown = await Ride.aggregate([
      {
        $group: {
          _id: { source: '$source', destination: '$destination' },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeRides,
        completedRides,
        totalRequests,
        acceptedRequests,
        pendingReports,
        popularRoutes: routeBreakdown.map((r) => ({
          route: `${r._id.source} → ${r._id.destination}`,
          count: r.count,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get list of all platform users
// @route   GET /api/admin/users
// @access  Protected (Admin Only)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle verification or suspension status of a user
// @route   PATCH /api/admin/users/:id/status
// @access  Protected (Admin Only)
const toggleUserStatus = async (req, res) => {
  try {
    const { isVerified } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (isVerified !== undefined) user.isVerified = isVerified;
    await user.save();

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all user reports
// @route   GET /api/admin/reports
// @access  Protected (Admin Only)
const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('reporter', 'name email college phone')
      .populate('reportedUser', 'name email college phone rating')
      .populate('ride')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Resolve or dismiss a report
// @route   PATCH /api/admin/reports/:id
// @access  Protected (Admin Only)
const resolveReport = async (req, res) => {
  try {
    const { status } = req.body;
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found.' });
    }

    report.status = status;
    if (status === 'resolved' || status === 'dismissed') {
      report.resolvedAt = new Date();
    }
    await report.save();

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getStats,
  getUsers,
  toggleUserStatus,
  getReports,
  resolveReport,
};
