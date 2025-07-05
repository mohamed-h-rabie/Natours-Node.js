const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

const cathcAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });
};
exports.signUp = cathcAsync(async (req, res, next) => {
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    photo: req.body.photo,
    role: req.body.role,
    changePasswordAt: req.body.changePasswordAt,
  };

  const newUser = await User.create(user);
  const token = generateToken(newUser._id);
  res.status(201).json({
    message: 'success',
    token,
    data: {
      newUser,
    },
  });
});

exports.signIn = cathcAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1// Ensure that user write a his email and password
  if (!email || !password) {
    return next(new AppError('You should enter your email and password', 400));
  }

  // 2// Ensure that user write a his correct (email and password)

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new AppError('your password or email is incorrect', 400));
  }
  const correct = await user.correctPassword(user.password, password);
  if (!correct) {
    return next(new AppError('your password or email is incorrect', 400));
  }

  const token = generateToken(user._id);
  res.status(201).json({
    message: 'success',
    token,
  });
});

exports.protectRoute = cathcAsync(async (req, res, next) => {
  let token;
  // 1 // check if headers contain token
  if (
    !req.headers.authorization ||
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  console.log(req.headers);

  if (!token) {
    return next(new AppError('Not Authorized, no token', 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(
      new AppError('the user that belong to this token become not found', 401)
    );
  }
  if (user.changePasswordAfter(decoded.iat)) {
    return next(new AppError('you should login again', 401));
  }
  req.user = user;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log(roles, 'dwdewd');

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('you havenot permisstion to delete a tour', 403)
      );
    }
    next();
  };
};
exports.forgetPassword = cathcAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no email with this email address', 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  next();
});
