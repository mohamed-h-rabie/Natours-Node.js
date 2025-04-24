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

app.get(toursRoute, (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
});
app.get(`${toursRoute}/:id`, (req, res) => {
  const id = req.params.id;
  const tour = tours.find((tour) => +tour.id === +id);
  if (!tour) {
   return  res.status(404).json({
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
});
app.post(toursRoute, (req, res) => {
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
});

// app.get('/', (req, res) => {
//   res.status(200).json({
//     message: 'hello from serverside',
//     app: 'Natrous app',
//   });
// });

app.listen(port, () => {
  console.log(`server is running in port ${port}`);
});
