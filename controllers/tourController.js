const Tour = require('../models/tourModel');
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );

// exports.checkID = (req, res, next, val) => {
//   if (val > tours.length - 1) {
//     return res.status(404).json({
//       message: 'failed : invalidID',
//     });
//   }
//   next();
// };
// exports.checkBody = (req, res, next) => {
//   console.log(req.body);
//   const keys = Object.keys(req.body);
//   if (!keys.includes('name') || !keys.includes('price')) {
//     return res.status(404).json({
//       message: 'missing name or price',
//     });
//   }
//   next();
// };
exports.getAllTours = async (req, res) => {
  // 1A/FilterData
  const queryObj = { ...req.query };
  const ignoredQuery = ['page', 'sort', 'limit', 'fields'];
  ignoredQuery.forEach((el) => delete queryObj[el]);

  // 1B/Advanced FilterData

  let queryString = JSON.stringify(queryObj);

  queryString = queryString.replace(
    /\b(gte|lte|lt|gt)\b/g,
    (match) => `$${match}`,
  );

  const query = Tour.find(JSON.parse(queryString));
  // 2/Sorting Data

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query.sort(sortBy);
  } else {
    const sortBy = '-createdAt';
    query.sort(sortBy);
  }

  // 3/Limiting Fields Data
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query.select(fields);
  } else {
    query.select('-__v');
  }
  // 4/Pagination
  // if (req.query.limit || req.query.page) {
  const page = req.query.page || 1;
  const limit = req.query.limit || 100;
  const skip = (page - 1) * limit;
  query.skip(skip).limit(limit);
  // }
  if (req.query.page) {
    const numOfTours = await Tour.countDocuments();
    // console.log(numOfTours);

    if (skip > numOfTours) throw new Error('page not found');
  }
  const tours = await query;
  try {
    res.status(200).json({
      status: 'success',
      requestTime: req.respondTime,

      results: tours.length,
      data: { tours },
    });
  } catch (error) {
    res.status(404).json({
      status: 'error not found',
    });
  }
};

exports.getTour = async (req, res) => {
  const tourID = await Tour.findById(req.params.id);

  try {
    res.status(200).json({
      status: 'success',
      data: {
        tourID,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'error not found',
    });
  }
};

exports.postTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        Tour: newTour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'we couldnot create new Tour',
    });
  }
};
exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      message: `Tour num ${req.params.id} is updated`,
      data: {
        Tour: updatedTour,
      },
    });
  } catch (error) {
    res.status(200).json({
      status: 'failed',
    });
  }
};
exports.deleteTour = (req, res) => {
  // const updatedTours = tours.filter((Tour) => +Tour.id !== +req.params.id);
  // fs.writeFile(
  //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   JSON.stringify(updatedTours),
  //   (err) => {
  //     res.status(200).json({
  //       status: 'success',
  //       message: `Tour num ${req.params.id} is deleted`,
  //     });
  //   },
  // );
};
