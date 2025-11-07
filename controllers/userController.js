const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const { deleteOne, getOne } = require('../controllers/handleFactory');
const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');
const cathcAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};
const filteredObj = (obj, ...allowedFieldToUpdate) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFieldToUpdate.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};
exports.getUser = getOne(User);

exports.getMe = (req, res, next) => {
  console.log(req.user.id);

  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  req.params.id = req.user.id;
  console.log('hello');
  next();
};

exports.updateMe = cathcAsync(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        'this route is not for update password,please use /updatePassword route',
        400
      )
    );
  }
  const filteredBody = filteredObj(req.body, 'email', 'name');
  console.log(filteredBody);

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    runValidators: true,
    new: true,
  });
  res.status(201).json({
    message: 'success',
    data: {
      updatedUser,
    },
  });
});
exports.deleteMe = cathcAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.user.id, { active: false });
  res.status(201).json({
    message: 'success',
    data: {},
  });
});
exports.deleteUser = deleteOne(User);
exports.getUsers = cathcAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(201).json({
    message: 'success',
    data: {
      users,
    },
  });
});

exports.getBookingsTours = async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });

  const toursIDS = bookings.map((booking) => booking.tour);
console.log(toursIDS);

  const tours = await Tour.find({ _id: { $in: toursIDS } });

  res.status(200).json({
    message: 'success',
    data: {
      tours,
    },
  });
};
