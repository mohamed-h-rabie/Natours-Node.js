//Requirements
const express = require('express');
const app = express();
// import Routes
const tourRouter = require('./Routes/tourRoutes');
const userRouter = require('./Routes/userRoutes');
//Middlewares
var morgan = require('morgan');
// Using Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  console.log('hello');
  req.respondTime = new Date().toISOString();
  next();
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);
module.exports = app;
