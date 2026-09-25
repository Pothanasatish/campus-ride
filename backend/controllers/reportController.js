const Report = require('../models/Report');

// @desc    Submit report against a problematic user
// @route   POST /api/reports
// @access  Protected
const createReport = async (req, res) => {
  try {
    const { reportedUserId, rideId, reason, description } = req.body;

    if (!reportedUserId || !reason || !description) {
      return res.status(400).json({
        success: false,
        message: 'Reported user ID, reason, and detailed description are required.',
      });
    }

    if (reportedUserId === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot report yourself.' });
    }

    const report = await Report.create({
      reporter: req.user.id,
      reportedUser: reportedUserId,
      ride: rideId || null,
      reason,
      description,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully. Our safety moderation team will inspect it.',
      data: report,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createReport,
};
