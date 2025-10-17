const mongoose = require('mongoose');
const Tour = require('../models/tourModel');
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'A review Must have a Content'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A review Must have an owner'],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'A review Must have an tour'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtual: true } }
);
reviewSchema.pre(/^find/, function (next) {
  const reviews = this;
  reviews
    .populate({ path: 'user', select: 'name email' })
    .populate({ path: 'tour', select: 'name' });
  next();
});

reviewSchema.statics.clacAvgCountRatings = async function (tourId) {
  const stats = await Review.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: 'tour',
        numRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  console.log(stats);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].numRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0,
    });
  }
};
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });
reviewSchema.post('save', function (doc) {
  console.log(doc, 'doc');

  Review.clacAvgCountRatings(doc.tour);
});
reviewSchema.post(/^findOneAnd/, function (doc) {
  // console.log(Review);
  console.log(doc);

  Review.clacAvgCountRatings(doc.tour._id);
});
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
