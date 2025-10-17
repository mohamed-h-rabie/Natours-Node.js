const express = require('express');
const app = express();
const tourRoute = require('./routes/tourRoute');
const userRoute = require('./routes/userRoute');
const rateLimit = require('express-rate-limit');
const reviewRoute = require('./routes/reviewRoute');
const AppError = require('./utils/AppError');
const error = require('./controllers/errorController');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
var qs = require('qs');

//middlware
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(express.json({ limit: '10kb' }));
app.use(morgan('dev'));
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 100,
  message: 'Too many requests from this IP , please try again in an hour',
});

// Apply the rate limiting middleware to all requests.
app.use(limiter);
app.use((req, res, next) => {
  req.respondTime = new Date().toISOString();
  next();
});

app.set('query parser', (str) => qs.parse(str));

//Routes
app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/reviews', reviewRoute);

app.all('/{*any}', (req, res, next) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server`, 404);

  next(err);
});

app.use(error);

module.exports = app;
