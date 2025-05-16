const fs = require('fs');
const tour = require('../models/tourModel');
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
  const tours = await tour.find();
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
  console.log(req.params.id);

  const tourID = await tour.findById(req.params.id);

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
    const newTour = await tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'we couldnot create new tour',
    });
  }
};
exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      message: `tour num ${req.params.id} is updated`,
      data: {
        tour: updatedTour,
      },
    });
  } catch (error) {
    res.status(200).json({
      status: 'failed',
    });
  }
};
exports.deleteTour = (req, res) => {
  // const updatedTours = tours.filter((tour) => +tour.id !== +req.params.id);
  // fs.writeFile(
  //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   JSON.stringify(updatedTours),
  //   (err) => {
  //     res.status(200).json({
  //       status: 'success',
  //       message: `tour num ${req.params.id} is deleted`,
  //     });
  //   },
  // );
};
