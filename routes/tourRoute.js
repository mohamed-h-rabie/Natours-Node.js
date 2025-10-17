const express = require('express');
const router = express.Router();
const reviewRoute = require('../routes/reviewRoute');
const {
  getAllTours,
  aliasTopTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  toursStats,
  monthlyPlan,
  minMaxPrice,
  getTourWithin,
  getNearLocations
} = require('../controllers/tourController');
router.use('/:tourId/reviews', reviewRoute);

const { protectRoute, restrictTo } = require('../controllers/authController');
//Nested Route

router
  .route('/toursWithin/:distance/center/:latlng/unit/:unit')
  .get(getTourWithin);
router
  .route('/distances/:latlng/unit/:unit')
  .get(getNearLocations);
router.route('/topFiveTours').get(aliasTopTours, getAllTours);

router.route('/minMaxPrice').get(aliasTopTours, minMaxPrice);
router.route('/tours-stats').get(toursStats);
router
  .route('/monthlyPlan/:year')
  .get(protectRoute, restrictTo('admin', 'lead-guide', 'guide'), monthlyPlan);

router
  .route('/')
  .get(getAllTours)
  .post(protectRoute, restrictTo('admin', 'lead-guide'), createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(protectRoute, restrictTo('admin', 'lead-guide'), updateTour)
  .delete(protectRoute, restrictTo('admin', 'lead-guide'), deleteTour);
3;

module.exports = router;
// router.route('/countOfToursMedium').get(aliasTopTours, countOfToursMedium);
// router
//   .route('/ratingsAverageOfTours')
//   .get(aliasTopTours, ratingsAverageOfTours);
// router
//   .route('/AveragePricePerDifficulty')
//   .get(aliasTopTours, AveragePricePerDifficulty);
// router
//   .route('/Statsonlyfortourswithrating')
//   .get(aliasTopTours, Statsonlyfortourswithrating);
// router
//   .route('/Sortdifficultiesbyaverageprice')
//   .get(aliasTopTours, Sortdifficultiesbyaverageprice);
// router.route('/Ignoresecrettours').get(aliasTopTours, Ignoresecrettours);
// router
//   .route('/Grouptoursbydurationbuckets')
//   .get(aliasTopTours, Grouptoursbydurationbuckets);
// router
//   .route('/Advancedstatsperdifficulty')
//   .get(aliasTopTours, Advancedstatsperdifficulty);
// router
//   .route('/Topmostexpensivetours')
//   .get(aliasTopTours, Topmostexpensivetours);

// AveragePricePerDifficulty,
// Statsonlyfortourswithrating,
// Sortdifficultiesbyaverageprice,
// Ignoresecrettours,
// Grouptoursbydurationbuckets,
// Advancedstatsperdifficulty,
// Topmostexpensivetours,
//   countOfToursMedium,
// ratingsAverageOfTours,
//   populateReviews,
