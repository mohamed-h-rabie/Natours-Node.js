const AppError = require('../utils/AppError');
const castErrors = (err) => {
  const path = err.path;
  const value = err.value;
  return new AppError(`Can't find this ${value} ${path}`, 400);
};
const devError = (err, res) => {
  console.log(err);

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};
const prodError = (err, res) => {
  if (err.isOperation) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'something went vey wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // if (process.env.NODE_ENV === 'development') {
  //   let error = JSON.parse(JSON.stringify(err));
  //   console.log(error);

  //   if (error.name === 'CastError') {
  //     error = castErrors(error);
  //   }
  //   devError(error, res);
  // } else if (process.env.NODE_ENV === 'production') {
  //   prodError(err, res);
  // }
  devError(err, res);
};
