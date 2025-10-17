const AppError = require('../utils/AppError');

const handleCastErrorDB = (error) => {
  return new AppError(`invalid ${error.path} ${error.value}`, 400);
};

const handleDublicateDBFields = (error) => {
  const value = error.message.match(/"([^"]+)"/)[1];
  console.log(value);

  return new AppError(
    `Duplicate field value ${value}. please use another`,
    400
  );
};


const handleValidationError = (error) => {
  const values = Object.values(error.errors).map((el) => el.message);
  const message = `Invalid Input Data. ${values.join(', ')}`;
  return new AppError(message, 400);
};
const handleTokenError = (error) => {
  const message = `Invalid Token , Please login again`;
  return new AppError(message, 401);
};
const handleExpiryTokenError = (error) => {
  const message = `Expired Token , Please login again`;
  return new AppError(message, 401);
};



const devErrors = (res, err) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};
const prodErrors = (res, err) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'something went very wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    // if (err.name === 'CastError') error = handleCastErrorDB(error);
    // if (err.code === 11000) error = handleDublicateDBFields(error);

    devErrors(res, err);
  } else if (process.env.NODE_ENV === 'production') {
    let error = {
      ...err,
      name: err.name,
      message: err.message,
    };

    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDublicateDBFields(error);
    if (err.name === `ValidationError`) error = handleValidationError(error);
    if (err.name === 'JsonWebTokenError') error = handleTokenError(error);
    if (err.name === 'TokenExpiredError') error = handleExpiryTokenError(error);
    prodErrors(res, error);
  }
};
