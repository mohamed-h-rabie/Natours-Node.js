const express = require('express');
const fs = require('fs');
const { url } = require('inspector');
const app = express();
app.use(express.json());
const port = 3000;
const toursRoute = '/api/v1/tours';
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
app.use((req, res, next) => {
  console.log('hello');

  req.respondTime = new Date().toISOString();
  next();
});
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestTime: req.respondTime,

    results: tours.length,
    data: { tours },
  });
};
const getTour = (req, res) => {
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

const postTour = (req, res) => {
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
const updateTour = (req, res) => {
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
const deleteTour = (req, res) => {
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

app.route(toursRoute).get(getAllTours).post(postTour);
app
  .route(`${toursRoute}/:id`)
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);
// app.get(toursRoute, getAllTours);
// app.post(toursRoute, postTour);
// app.get(`${toursRoute}/:id`, getTour);

// app.patch(`${toursRoute}/:id`, updateTour);
// app.delete(`${toursRoute}/:id`, deleteTour);

app.listen(port, () => {
  console.log(`server is running in port ${port}`);
  console.log(`Access the app at http://192.168.1.2:${port}`);
});
