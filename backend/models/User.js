const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'College email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // Security requirement: do not return password by default
    },
    college: {
      type: String,
      required: [true, 'College/University name is required'],
      trim: true,
      index: true,
    },
    branch: {
      type: String,
      required: [true, 'Branch/Department is required'],
      trim: true,
    },
    year: {
      type: String,
      required: [true, 'Academic year is required'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 1.0,
      max: 5.0,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
