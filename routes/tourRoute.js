const express = require('express');
const router = express.Router();
const {
  getAllTours,
  aliasTopTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  toursStats,
  monthlyPlan,
} = require('../controllers/tourController');
const { protectRoute, restrictTo } = require('../controllers/authController');

router.route('/topFiveTours').get(aliasTopTours, getAllTours);
router.route('/tours-stats').get(toursStats);
router.route('/monthlyPlan/:year').get(monthlyPlan);

router.route('/').get(protectRoute, getAllTours).post(createTour);
router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(protectRoute, restrictTo('admin'), deleteTour);

module.exports = router;
