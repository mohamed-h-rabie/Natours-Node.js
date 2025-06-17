const express = require('express');
const app = express();
const tourRoute = require('./Routes/tourRoute');
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

module.exports = app;
