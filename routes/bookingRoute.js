const authController = require('../controllers/authController');
const {
  getCheckoutSession,
  createBooking,
} = require('../controllers/bookingController');
const express = require('express');
const router = express.Router();
router.get(
  '/checkout-session/:tourId',
  authController.protectRoute,
  getCheckoutSession
);
router.post('/', authController.protectRoute, createBooking);

module.exports = router;
