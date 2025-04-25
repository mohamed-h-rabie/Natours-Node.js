const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestTime: req.respondTime,

    results: tours.length,
    data: { tours },
  });
};

exports.getTour = (req, res) => {
  const id = req.params.id;
  const tour = tours.find((tour) => +tour.id === +id);
  if (!tour) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invailed ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.postTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};
exports.updateTour = (req, res) => {
  if (req.params.id > tours.length - 1) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invailed ID',
    });
  }
  res.status(200).json({
    status: 'success',
    message: `tour num ${req.params.id} is updated`,
  });
};
exports.deleteTour = (req, res) => {
  if (req.params.id > tours.length - 1) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invailed ID',
    });
  }
  const updatedTours = tours.filter((tour) => +tour.id !== +req.params.id);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(updatedTours),
    (err) => {
      res.status(200).json({
        status: 'success',
        message: `tour num ${req.params.id} is deleted`,
      });
    }
  );
};
