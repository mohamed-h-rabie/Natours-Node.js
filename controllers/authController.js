const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const path = require('path'); // ✅ Add this line

const multer = require('multer');
const sharp = require('sharp');
const { emailSender, templates } = require('../utils/email');
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, '../public/img/users'));
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image , please upload an image', 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.uploadUserPhoto = upload.single('photo');

exports.resizePhoto = async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  // console.log(path.join(__dirname, `../public/img/users/${req.file.filename}`) ,s);

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(path.join(__dirname, `../public/img/users/${req.file.filename}`));
  next();
};
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
    secure: true,
  };
  res.cookie('jwt', token, cookieOptions);
  // user.password = undefined;
  res.status(201).json({
    message: 'success',
    token,
  });
};
exports.signUp = cathcAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  const user = await User.create({ name, email, password, confirmPassword });
  const id = user.id;
  const token = generateToken(id);

  await emailSender({
    to: 'hossamhabdalla3@gmail.com',
    subject: 'Successfully Registered',
    html: templates.welcome(req.body.name),
  });
  res.status(200).json({
    message: 'success',
    token,
    data: {
      user,
    },
  });
});

exports.signIn = cathcAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1// Ensure that user write a his email and password

  if (!email || !password) {
    return next(new AppError('you should write your email and password', 401));
  }

  // 2// Ensure that user write a his correct (email and password)
  const user = await User.findOne({ email }).select('+password');
  console.log(user);

  // const correctPassword =
  // console.log(user, correctPassword);

  // if (!user || !(await user.correctPassword(user.password, password))) {
  //   return next(new AppError('you enter a wrong password or email', 401));
  // }
  const id = user.id;

  const token = createNewToken(res, id);

  res.status(200).json({
    message: 'Success',
    token,
  });
});

exports.protectRoute = cathcAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // console.log(req);

  if (req.cookie && req.cookie.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) return next(new AppError('Not Authorized, no token', 401));

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // console.log(decoded);

  const user = await User.findById(decoded.id);
  // console.log(user);
  if (!user) {
    return next(
      new AppError('the user that belong to this token become not found', 401)
    );
  }

  if (user.changePasswordAfter(decoded.iat)) {
    return next(new AppError('you should login again', 401));
  }
  console.log(user);

  req.user = user;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`you haven't permisstion to do this action`, 403)
      );
    }
    next();
  };
};
exports.forgetPassword = cathcAsync(async (req, res, next) => {
  //getUserdata from email
  //create passwordresetToken
  //send it with mail

  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new AppError('this user not found , please login', 401));

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `http://127.0.0.1:3000/api/v1/users/resetPassword/${resetToken}`;
  // const transporter = nodemailer.createTransport({
  //   service: 'Gmail',
  //   auth: {
  //     user: 'mohamed.hassa3nnn@gmail.com',
  //     pass: 'ihtu cfey zspv aoui',
  //   },
  // });
  // await transporter.sendMail({
  //   to: 'hossamhabdalla3@gmail.com',
  //   subject: 'Password Reset',
  //   html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. It expires in 15 mins.</p>`,
  // });
  await emailSender({
    to: 'hossamhabdalla3@gmail.com',
    subject: 'Reset Your Password',
    html: templates.resetPassword(resetUrl),
  });
  res.status(200).json({
    status: 'success',
    message: 'Password reset link sent to your email!',
  });
  // next();
});
exports.resetPassword = cathcAsync(async (req, res, next) => {
  //take token and password entered by user
  //hashtoken and compare it with in db and also passwordResetExpires should bt gt than now
  // then update password in db
  const { token } = req.params;
  console.log(token);
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

  const tokenn = generateToken(user._id);
  res.status(200).json({ message: 'Password has been reset', tokenn });
});

exports.updatePassword = cathcAsync(async (req, res, next) => {
  const { email } = req.user;
  const user = await User.findOne({ email }).select('+password');

  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  const correct = await user.correctPassword(user.password, currentPassword);
  if (!correct) {
    return next(new AppError('your currentPassword is incorrect', 400));
  }
  user.password = newPassword;
  user.confirmPassword = confirmNewPassword;
  await user.save();
  createNewToken(res, user._id);
  console.log(req.headers);
});

const filteredObj = (body, ...filterdData) => {
  const obj = {};
  Object.keys(body).forEach((el) => {
    if (filterdData.includes(el)) {
      obj[el] = body[el];
    }
  });
  return obj;
};
exports.updateMe = cathcAsync(async (req, res, next) => {
  console.log(req.file);
  console.log(req.body);

  if (req.body.password || req.body.confirmPassword)
    return next(new AppError('this route is not for update password', 400));
  const filteredBody = filteredObj(req.body, 'name', 'email');
  console.log(filteredBody);
  if (req.file) filteredBody.photo = req.file.filename;
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    runValidators: true,
    new: true,
  });
  res.status(200).json({
    message: 'success',
    data: updatedUser,
  });
});

exports.deleteMe = cathcAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({
    message: 'success',
    data: null,
  });
});
// exports.updatePassword = cathcAsync(async (req, res, next) => {
//   const token = req.headers.authorization.split(' ')[1];
//   const id = jwt.decode(token).id;
//   const user = await User.findById(id).select('+password');
//   const { currentPassword, newPassword, confirmNewPassword } = req.body;
//   // console.log(currentPassword, newPassword, );
//   const correct = await user.correctPassword(user.password, currentPassword);
//   if (!correct) {
//     return next(new AppError('your currentPassword is incorrect', 400));updateMe
//   }
//   user.password = newPassword;
//   user.confirmPassword = confirmNewPassword;
//   await user.save();
//   createNewToken(res, user._id);
// });
