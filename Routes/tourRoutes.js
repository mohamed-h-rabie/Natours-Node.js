const express = require('express');
const router = express.Router();
const {
  getAllTours,
  getTour,
  postTour,
  updateTour,
  deleteTour,
} = require('../controllers/tourController');

// router.param('id', checkID);

router.route('/').get(getAllTours).post(postTour);
router.route(`/:id`).get(getTour).patch(updateTour).delete(deleteTour);
module.exports = router;
