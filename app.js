//Requirements
const express = require('express');
const app = express();
// import Routes
const tourRouter = require('./Routes/tourRoutes');
const userRouter = require('./Routes/userRoutes');
//Middlewares
var morgan = require('morgan');
const qs = require('qs');

// Using Middleware
app.use(express.json());
// Set a custom query parser using qs
app.set('query parser', (str) => qs.parse(str));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  req.respondTime = new Date().toISOString();
  next();
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);
module.exports = app;
