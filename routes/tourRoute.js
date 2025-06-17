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
  monthlyPlan
} = require('../controllers/tourController');

router.route('/topFiveTours').get(aliasTopTours, getAllTours);
router.route('/tours-stats').get(toursStats);
router.route('/monthlyPlan/:year').get(monthlyPlan);

router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
