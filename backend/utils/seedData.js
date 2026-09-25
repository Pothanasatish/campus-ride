const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Ride = require('../models/Ride');
const RideRequest = require('../models/RideRequest');
const Review = require('../models/Review');
const Report = require('../models/Report');
const Notification = require('../models/Notification');

const autoSeedData = async () => {
  try {
    const existingUsersCount = await User.countDocuments();
    if (existingUsersCount > 0) {
      console.log('[Seed] Database already contains records. Skipping auto-seed.');
      return;
    }

    console.log('[Seed] Seeding initial demo data...');

    // Password Hashing
    const salt = await bcrypt.genSalt(10);
    const commonPassword = await bcrypt.hash('password123', salt);

    // Create Users
    const users = await User.create([
      {
        name: 'Satish Verma',
        email: 'satish.verma@srkr.edu.in',
        password: commonPassword,
        college: 'SRKR Engineering College',
        branch: 'Computer Science & Engineering',
        year: '3rd Year',
        phone: '+91 98765 43210',
        role: 'student',
        rating: 4.9,
        totalRatings: 14,
        isVerified: true,
        bio: '3rd Year CSE student commuting daily from Bhimavaram Town Center. Riding a Royal Enfield Hunter 350.',
      },
      {
        name: 'Ananya Rao',
        email: 'ananya.rao@srkr.edu.in',
        password: commonPassword,
        college: 'SRKR Engineering College',
        branch: 'Information Technology',
        year: '3rd Year',
        phone: '+91 98123 45678',
        role: 'student',
        rating: 4.8,
        totalRatings: 9,
        isVerified: true,
        bio: 'Looking for reliable daily commute options from Palakoderu junction to campus.',
      },
      {
        name: 'Vikram Reddy',
        email: 'vikram.reddy@srkr.edu.in',
        password: commonPassword,
        college: 'SRKR Engineering College',
        branch: 'Electronics & Communication',
        year: '4th Year',
        phone: '+91 99887 76655',
        role: 'student',
        rating: 5.0,
        totalRatings: 22,
        isVerified: true,
        bio: '4th Year ECE student. Commuting in Hyundai i20. 3 seats available.',
      },
      {
        name: 'Campus Admin',
        email: 'admin@campusride.edu',
        password: commonPassword,
        college: 'SRKR Engineering College',
        branch: 'Administration',
        year: 'Faculty Lead',
        phone: '+91 90000 00000',
        role: 'admin',
        rating: 5.0,
        totalRatings: 0,
        isVerified: true,
        bio: 'System Administrator & Safety Moderator for CampusRide.',
      },
    ]);

    const [satish, ananya, vikram] = users;

    // Create Rides
    const rides = await Ride.create([
      {
        driver: satish._id,
        college: 'SRKR Engineering College',
        source: 'Bhimavaram Town Center',
        destination: 'SRKR Campus Gate 1',
        pickupPoints: ['Town Hall Junction', 'Old Bus Stand', 'JNR Circle'],
        departureTime: '08:00 AM',
        returnTime: '05:30 PM',
        recurringDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        availableSeats: 1,
        totalSeats: 1,
        vehicleType: 'Bike',
        vehicleModel: 'Royal Enfield Hunter 350',
        vehicleNumber: 'AP 37 BK 4092',
        status: 'active',
        notes: 'Strict punctuality. Helmet mandatory for passenger.',
      },
      {
        driver: vikram._id,
        college: 'SRKR Engineering College',
        source: 'Palakoderu Highway',
        destination: 'SRKR Main Library',
        pickupPoints: ['Palakoderu Junction', 'Bypass Checkpost'],
        departureTime: '08:15 AM',
        returnTime: '05:00 PM',
        recurringDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        availableSeats: 3,
        totalSeats: 3,
        vehicleType: 'Car',
        vehicleModel: 'Hyundai i20 Asta',
        vehicleNumber: 'AP 37 CA 8821',
        status: 'active',
        notes: 'AC car ride with regular daily playlist. Fuel sharing friendly.',
      },
    ]);

    const [ride1] = rides;

    // Create Sample Ride Request
    const request1 = await RideRequest.create({
      ride: ride1._id,
      requester: ananya._id,
      seatsRequested: 1,
      message: 'Hi Satish, I commute daily from Town Hall junction around 8:05 AM. Can I join?',
      status: 'pending',
    });

    // Create Sample Notification
    await Notification.create({
      recipient: satish._id,
      type: 'request_received',
      title: 'New Ride Request',
      message: 'Ananya Rao requested 1 seat for your ride from Bhimavaram Town Center to SRKR Campus Gate 1.',
      relatedRide: ride1._id,
      relatedRequest: request1._id,
    });

    console.log('[Seed] Sample dataset auto-populated successfully!');
  } catch (error) {
    console.error('[Seed Error]:', error);
  }
};

module.exports = autoSeedData;
