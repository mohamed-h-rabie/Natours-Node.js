const express = require('express');
const router = express.Router();

const {
  signUp,
  signIn,
  forgetPassword,
  resetPassword,
  updatePassword,
  protectRoute,
  updateMe,
  deleteMe,
  restrictTo,
  uploadUserPhoto,
  resizePhoto,
} = require('../controllers/authController');
const {
  // updateMe,
  getUsers,
  // deleteMe,
  deleteUser,
  getMe,
  getUser,
  getBookingsTours,
} = require('../controllers/userController');

router.route('/signUp').post(signUp);
router.route('/signIn').post(signIn);
router.route('/forgetPassword').post(forgetPassword);
router.route('/resetPassword/:token').post(resetPassword);
///////////////////////////////////////////////////////////////////
router.use(protectRoute);
router.route('/').get(getUsers);
router.route('/:id').delete(deleteUser);
router.route('/getMe').get(protectRoute, getMe, getUser);
router.route('/MyBookings').get(protectRoute, getBookingsTours);

// ------------------------------------------------

router.route('/updatePassword').patch(updatePassword);
router.patch('/updateMe', uploadUserPhoto, resizePhoto, updateMe);
router.patch('/deleteMe', deleteMe);
module.exports = router;
