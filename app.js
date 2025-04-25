const express = require('express');
const tourRouter = require('./Routes/tourRoutes');
const userRouter = require('./Routes/userRoutes');
const bodyParser = require('body-parser');
var morgan = require('morgan');

// app.use(express.json());
const app = express();
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use((req, res, next) => {
  console.log('hello');

  req.respondTime = new Date().toISOString();
  next();
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

module.exports = app;
