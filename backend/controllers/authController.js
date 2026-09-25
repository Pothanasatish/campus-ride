const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new student account
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, college, branch, year, phone } = req.body;

    if (!name || !email || !password || !college || !branch || !year) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required registration fields.',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this college email already exists.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const role = email.toLowerCase().includes('admin@campusride.edu') ? 'admin' : 'student';

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      college,
      branch,
      year,
      phone: phone || '',
      role,
      isVerified: true,
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        branch: user.branch,
        year: user.year,
        phone: user.phone,
        role: user.role,
        rating: user.rating,
        totalRatings: user.totalRatings,
        isVerified: user.isVerified,
        token,
      },
    });
  } catch (error) {
    console.error('[Register Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & return JWT
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        branch: user.branch,
        year: user.year,
        phone: user.phone,
        role: user.role,
        rating: user.rating,
        totalRatings: user.totalRatings,
        isVerified: user.isVerified,
        token,
      },
    });
  } catch (error) {
    console.error('[Login Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get currently logged in user profile
// @route   GET /api/auth/me
// @access  Protected
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Protected
const updateProfile = async (req, res) => {
  try {
    const { name, branch, year, phone, bio } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    if (name) user.name = name;
    if (branch) user.branch = branch;
    if (year) user.year = year;
    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;

    const updatedUser = await user.save();
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
};
