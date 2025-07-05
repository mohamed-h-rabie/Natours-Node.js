// const Tour = require('../models/tourModel');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/ApiFeatures');
const AppError = require('../utils/AppError');
const cathcAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};
exports.aliasTopTours = (req, res, next) => {
  req.url =
    '?limit=5&sort=-ratingsAverage,price&fields=name,price,ratingsAverage';

  next();
};

exports.getAllTours = cathcAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour, req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();

  const tours = await features.query;

  res.status(200).json({
    status: 'successed',
    length: tours.length,
    time: req.respondTime,
    data: {
      tours,
    },
  });
});

exports.getTour = cathcAsync(async (req, res, next) => {
  const id = req.params.id;
  const tour = await Tour.findById(id);
  if (!tour) {
    return next(new AppError(`No tour founded with that ID ${id}`, 404));
  }
  res.status(200).json({
    status: 'successed',
    time: req.respondTime,
    data: {
      tour,
    },
  });
});

exports.createTour = cathcAsync(async (req, res) => {
  const tour = await Tour.create(req.body);
  res.status(200).json({
    status: 'successed',
    time: req.respondTime,
    data: {
      tour,
    },
  });
});
exports.deleteTour = cathcAsync(async (req, res, next) => {
  const id = req.params.id;

  const tour = await Tour.findByIdAndDelete(id);
  if (!tour) {
    return next(new AppError(`No tour founded with that ID ${id}`, 404));
  }
  res.status(200).json({
    status: 'successed',
    time: req.respondTime,
    data: {
      tour,
    },
  });
});
exports.updateTour = cathcAsync(async (req, res , next) => {
  const id = req.params.id;

  const body = req.body;

  const tour = await Tour.findByIdAndUpdate(id, body);
  if (!tour) {
    return next(new AppError(`No tour founded with that ID ${id}`, 404));
  }
  res.status(200).json({
    status: 'successed',
    time: req.respondTime,
    data: {
      tour,
    },
  });
});

exports.toursStats = cathcAsync(async (req, res) => {
  const toursStats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gt: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
        avgRatings: { $max: '$ratingsAverage' },
        numRatings: { $max: '$ratingsQuantity' },
      },
    },
    {
      $sort: {
        avgPrice: -1,
      },
    },
  ]);
  res.status(200).json({
    status: 'successed',
    time: req.respondTime,
    data: {
      toursStats,
    },
  });
});

exports.monthlyPlan = cathcAsync(async (req, res) => {
  const month = [
    '',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const year = +req.params.year;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-1-1`),
          $lt: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTours: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: { $arrayElemAt: [month, '$_id'] } },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numTours: -1,
      },
    },
  ]);
  res.status(200).json({
    status: 'successed',
    time: req.respondTime,
    data: {
      plan,
    },
  });
});
