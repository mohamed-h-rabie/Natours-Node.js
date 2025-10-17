const express = require('express');
const router = express.Router({ mergeParams: true });
const authController = require('../controllers/authController');
const {
  createReview,
  getAllReviews,
  getReview,
  deleteReview,
  setTourUserId,
  updateReview,
} = require('../controllers/reviewController');
router.use(authController.protectRoute);

router
  .route('/')
  .post(authController.restrictTo('user', 'admin'), setTourUserId, createReview)
  .get(getAllReviews);
router
  .route('/:id')
  .get(getReview)
  .delete(authController.restrictTo('user', 'admin'), deleteReview)
  .patch(authController.restrictTo('user', 'admin'), updateReview);

module.exports = router;
