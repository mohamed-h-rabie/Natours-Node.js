const express = require('express');
const router = express.Router();

const {
  signUp,
  signIn,
  forgetPassword,
  resetPassword,
  updatePassword,
  protectRoute,
} = require('../controllers/authController');
const {
  updateMe,
  getUsers,
  deleteMe,
} = require('../controllers/userController');

router.route('/').get(getUsers);
router.route('/signUp').post(signUp);
router.route('/signIn').post(signIn);
router.route('/forgetPassword').post(forgetPassword);
router.route('/resetPassword/:token').post(resetPassword);
router.patch('/updatePassword', protectRoute, updatePassword);
router.patch('/updateMe', protectRoute, updateMe);
router.patch('/deleteMe', protectRoute, deleteMe);
module.exports = router;
