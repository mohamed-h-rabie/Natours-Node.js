const express = require('express');
const router = express.Router();

const {
  signUp,
  signIn,
  forgetPassword,
} = require('../controllers/authController');

router.route('/signUp').post(signUp);
router.route('/signIn').post(signIn);
router.route('/forgetPassword').post(forgetPassword);
module.exports = router;
