// const Tour = require('../models/tourModel');
const   Tour  = require('../models/tourModel');
const APIFeatures = require("../utils/apiFeatures")

exports.aliasTopTours = (req, res, next) => {
  req.url =
    '?limit=5&sort=-ratingsAverage,price&fields=name,price,ratingsAverage';

  next();
};

exports.getAllTours = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: error.message,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const id = req.params.id;
    const tour = await Tour.findById(id);
    res.status(200).json({
      status: 'successed',
      time: req.respondTime,
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: error.message,
    });
  }
};
exports.createTour = async (req, res) => {
  try {
    const validatedData = tourZodSchema.parse(req.body);

    const tour = await Tour.create(validatedData);
    res.status(200).json({
      status: 'successed',
      time: req.respondTime,
      data: {
        tour,
      },
    });
  } catch (error) {
    // res.status(404).json({
    //   status: 'failed',
    //   message: error.message,
    // });
    // if (error.name === 'ZodError') {
    res.status(400).json({ status: 'fail', errors: error.errors });
    // }
  }
};
exports.deleteTour = async (req, res) => {
  try {
    const id = req.params.id;

    const tour = await Tour.findByIdAndDelete(id);
    res.status(200).json({
      status: 'successed',
      time: req.respondTime,
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: error.message,
    });
  }
};
exports.updateTour = async (req, res) => {
  try {
    const id = req.params.id;

    const body = req.body;

    const tour = await Tour.findByIdAndUpdate(id, body);
    res.status(200).json({
      status: 'successed',
      time: req.respondTime,
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: error.message,
    });
  }
};

exports.toursStats = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: error.message,
    });
  }
};

exports.monthlyPlan = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: error.message,
    });
  }
};
