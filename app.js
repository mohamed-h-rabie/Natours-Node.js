const express = require('express');
const app = express();
const tourRoute = require('./routes/tourRoute');
const userRoute = require('./routes/userRoute');
const AppError = require('./utils/AppError');
const error = require('./controllers/errorController');
const morgan = require('morgan');
var qs = require('qs');

//middlware
app.use(express.json());
app.use(morgan('dev'));
app.use((req, res, next) => {
  req.respondTime = new Date().toISOString();
  next();
});

app.set('query parser', (str) => qs.parse(str));

//Routes
app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', userRoute);
app.all('/{*any}', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} not found`,
  // });
  const err = new AppError(`Can't find ${req.originalUrl} not found`, 404);

  next(err);
});

app.use(error);

module.exports = app;
