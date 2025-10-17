const Review = require('../models/reviewModel');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('../controllers/handleFactory');
const cathcAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};

exports.setTourUserId = (req, res, next) => {
  const body = req.body;
  console.log(req.params.tourId, 'eq.params.tourId');

  if (!body.user) body.user = req.user.id;
  if (!body.tour) body.tour = req.params.tourId;
  next();
};
exports.getAllReviews = getAll(Review);
exports.createReview = createOne(Review);

exports.getReview = getOne(Review);
exports.deleteReview = deleteOne(Review);
exports.updateReview = updateOne(Review);
// exports.calvAvgRatings = async (req, res, next) => {
//   const tourIdd = req.params.tourid;

//   const stats = await Review.aggregate([
//     { $match: { tour: tourIdd } },
//     {
//       $group: {
//         _id: '$tour',
//         nRating: { $sum: 1 },
//         avgRating: { $avg: '$rating' },
//       },
//     },
//   ]);
//   console.log(stats);
//   res.status(200).json({
//     status: 'successed',
//     time: req.respondTime,
//     data: {
//       stats,
//     },
//   });
// };
