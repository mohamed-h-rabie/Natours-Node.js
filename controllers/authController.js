const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

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

const createNewToken = (res, id) => {
  const token = generateToken(id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.cookie('jwt', token, cookieOptions);
  res.status(201).json({
    message: 'success',
    token,
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
  req.user = user;

  createNewToken(res, user._id);
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
  const resetUrl = `http://127.0.0.1:3000/api/v1/users/resetPassword/${resetToken}`;
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'mohamed.hassa3nnn@gmail.com',
      pass: 'ihtu cfey zspv aoui',
    },
  });
  await transporter.sendMail({
    to: 'hossamhabdalla3@gmail.com',
    subject: 'Password Reset',
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. It expires in 15 mins.</p>`,
  });
  res.status(200).json({ message: 'Reset link sent' });

  next();
});
exports.resetPassword = cathcAsync(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError('Invalid or expired token', 400));
  }
  user.password = password;
  user.confirmPassword = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.status(200).json({ message: 'Password has been reset' });

  next();
});

exports.updatePassword = cathcAsync(async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const id = jwt.decode(token).id;
  const user = await User.findById(id).select('+password');
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  // console.log(currentPassword, newPassword, );

  const correct = await user.correctPassword(user.password, currentPassword);
  if (!correct) {
    return next(new AppError('your currentPassword is incorrect', 400));
  }
  user.password = newPassword;
  user.confirmPassword = confirmNewPassword;
  await user.save();
  createNewToken(res, user._id);
});
