const slugify = require('slugify');
const Tour = require('../models/tourModel');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('../controllers/handleFactory');
const path = require('path'); // ✅ Add this line
const multer = require('multer');
const AppError = require('../utils/AppError');
const sharp = require('sharp');
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

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image , please upload an image', 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadTourImages = upload.fields([
  {
    name: 'imageCover',
    maxCount: 1,
  },
  {
    name: 'images',
    maxCount: 3,
  },
]);

exports.resizeImageTours = async (req, res, next) => {
  // console.log(req.files);
  if (!req.files.imageCover || !req.files.images) return next();
  const images = req.files.images;
  const imageCover = req.files.imageCover[0];
  const tourName = slugify(req.body.name, { lower: true }); // <--- use tour name

  //
  req.body.imageCover = `tour-${tourName}-${Date.now()}-cover.jpeg`;
  await sharp(imageCover.buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(path.join(__dirname, `../public/img/tours/${req.body.imageCover}`));
  //
  req.body.images = [];
  await Promise.all([
    await images.map(async (image, i) => {
      const fileName = `tour-${tourName}-${Date.now()}-${i + 1}-image.jpeg`;
      sharp(image.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(path.join(__dirname, `../public/img/tours/${fileName}`));
      req.body.images.push(fileName);
    }),
  ]);
  // images.map((image) =>
  //   sharp(image.buffer)
  //     .resize(500, 500)
  //     .toFormat('jpeg')
  //     .jpeg({ quality: 90 })
  //     .toFile(path.join(__dirname, `../public/img/tours/${image.originalname}`))
  // );
  // console.log(imageCover);
  console.log(req);

  next();
};
// exports.getAllTours = cathcAsync(async (req, res, next) => {
//   // const query = Tour.find();
//   const queryObject = { ...req.query };
//   const excludedQueries = ['page', 'sort', 'limit', 'fields'];
//   excludedQueries.forEach((query) => delete queryObject[query]);
//   let queryString = JSON.stringify(queryObject);
//   queryString = queryString.replace(
//     /\b(gte|gt|lte|lt)\b/g,
//     (match) => `$${match}`
//   );
//   console.log(queryObject.sort);
//   let query = Tour.find(JSON.parse(queryString));
//   if (req.query.sort) {
//     const sortBy = req.query.sort.split(',').join(' ');
//     query = query.sort(sortBy);
//   } else {
//     query = query.sort('-createdAt');
//   }
//   if (req.query.fields) {
//     const fields = req.query.fields.split(',').join(' ');
//     query = query.select(fields);
//   } else {
//     query = query.select('-__v');
//   }
//   ///////////////////
//   const limit = req.query.limit || 100;
//   const page = req.query.page || 1;
//   const skip = (page - 1) * limit;
//   query = query.limit(limit).skip(skip);
//   if (req.query.page) {
//     const numberOfTours = await Tour.countDocuments();
//     if (skip > numberOfTours) throw new Error("this page doesn't exisit");
//   }
//   const tours = await query;
//   // .limit(limit)
//   // .skip(skip);

//   res.status(200).json({
//     status: 'successed',
//     length: tours.length,
//     time: req.respondTime,
//     data: {
//       tours,
//     },
//   });
// });
exports.getAllTours = getAll(Tour);

exports.getTour = getOne(Tour, { path: 'reviews' });
exports.createTour = createOne(Tour);
exports.deleteTour = deleteOne(Tour);
exports.updateTour = updateOne(Tour);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.getTourWithin = cathcAsync(async (req, res) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  console.log(radius, lat, lng);
  if (!lat || !lng) {
    new AppError('You should have a lat and lng');
  }
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  console.log(tours);

  res.status(200).json({
    status: 'successed',
    data: { tours },
  });
});
exports.getNearLocations = cathcAsync(async (req, res) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const multiplier = unit === 'mi' ? 0.000621 : 0.001;
  if (!lat || !lng) {
    new AppError('You should have a lat and lng');
  }
  const tours = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        name: 1,
        distance: 1,
      },
    },
  ]);
  console.log(tours);

  res.status(200).json({
    status: 'successed',
    data: { tours },
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
exports.countOfToursMedium = cathcAsync(async (req, res) => {
  const count = await Tour.aggregate([
    { $group: { _id: '$difficulty', countOfTours: { $sum: 1 } } },
  ]);
  res.status(200).json({
    status: 'successed',
    time: req.respondTime,
    data: {
      count,
    },
  });
});
exports.ratingsAverageOfTours = cathcAsync(async (req, res) => {
  const avg = await Tour.aggregate([
    {
      $group: {
        _id: null,
        rateAvg: { $avg: '$ratingsAverage' },
      },
    },
  ]);
  res.status(200).json({
    status: 'successed',
    time: req.respondTime,
    data: {
      avg,
    },
  });
});
exports.minMaxPrice = cathcAsync(async (req, res) => {
  const minMaxPrice = await Tour.aggregate([
    {
      $group: {
        _id: null,
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
  ]);
  res.status(200).json({
    status: 'successed',
    time: req.respondTime,
    data: {
      minMaxPrice,
    },
  });
});
exports.AveragePricePerDifficulty = cathcAsync(async (req, res) => {
  const AveragePricePerDifficulty = await Tour.aggregate([
    {
      $group: {
        _id: '$difficulty',
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
        avgPrice: { $avg: '$price' },
      },
    },
  ]);
  res.status(200).json({
    status: 'successed',
    time: req.respondTime,
    data: {
      AveragePricePerDifficulty,
    },
  });
});
exports.Statsonlyfortourswithrating = cathcAsync(async (req, res) => {
  const Statsonlyfortourswithrating = await Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } },
    {
      $group: {
        _id: null,
        numTours: { $sum: 1 },
        avgPrice: { $avg: '$price' },
        avgRating: { $avg: '$ratingsAverage' },
      },
    },
  ]);
  res.status(200).json({
    status: 'successed',
    time: req.respondTime,
    data: {
      Statsonlyfortourswithrating,
    },
  });
});
exports.Sortdifficultiesbyaverageprice = cathcAsync(async (req, res) => {
  const Sortdifficultiesbyaverageprice = await Tour.aggregate([
    {
      $group: {
        _id: '$difficulty',
        avgPrice: { $avg: '$price' },
        avgRating: { $avg: '$ratingsAverage' },
      },
    },
  ]);
  res.status(200).json({
    status: 'successed',
    time: req.respondTime,
    data: {
      Sortdifficultiesbyaverageprice,
    },
  });
});
exports.Ignoresecrettours = cathcAsync(async (req, res) => {
  const Ignoresecrettours = await Tour.aggregate([
    {
      $match: { secreteTour: false },
    },
    {
      $group: {
        _id: '$difficulty',
        numTours: { $sum: 1 },
      },
    },
    {
      $sort: { avgPrice: -1 },
    },
  ]);
  res.status(200).json({
    status: 'successed',
    time: req.respondTime,
    data: {
      Ignoresecrettours,
    },
  });
});
exports.Grouptoursbydurationbuckets = cathcAsync(async (req, res) => {
  const Grouptoursbydurationbuckets = await Tour.aggregate([
    {
      $bucket: {
        groupBy: '$duration',
        boundaries: [0, 2, 4, 6, 10],
        default: 'Other', // anything >= 100 days

        output: {
          numTours: { $sum: 1 },
          avgPrice: { $avg: '$price' },
        },
      },
    },
  ]);
  res.status(200).json({
    status: 'successed',
    time: req.respondTime,
    data: {
      Grouptoursbydurationbuckets,
    },
  });
});
exports.Advancedstatsperdifficulty = cathcAsync(async (req, res) => {
  const Advancedstatsperdifficulty = await Tour.aggregate([
    {
      $group: {
        _id: '$difficulty',
        numTours: { $sum: 1 },
        avgPrice: { $avg: '$price' },
        avgRating: { $avg: '$ratingsAverage' },
        totalRevenue: { $sum: { $multiply: ['$price', '$maxGroupSize'] } },
      },
    },
  ]);
  res.status(200).json({
    status: 'successed',
    time: req.respondTime,
    data: {
      Advancedstatsperdifficulty,
    },
  });
});
exports.Topmostexpensivetours = cathcAsync(async (req, res) => {
  const Topmostexpensivetours = await Tour.aggregate([
    {
      $project: {
        _id: 0,
        name: 1,
        price: 1,
      },
    },
    {
      $sort: { price: 1 },
    },
    {
      $limit: 5,
    },
  ]);
  res.status(200).json({
    status: 'successed',
    time: req.respondTime,
    data: {
      Topmostexpensivetours,
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
