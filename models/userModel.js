const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user should has a name'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  email: {
    type: String,
    required: [true, 'A user Should has an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'You should enter an Email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'A user Should has an password'],
    min: [8, 'user password should be equal 8 characters'],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'A user Should has an confirmPassword'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'passwords should be same',
    },
  },
  changePasswordAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  user.password = await bcrypt.hash(user.password, 12);
  user.confirmPassword = undefined;
  next();
});
userSchema.pre(/^find/, function (next) {
  const user = this;
  user.find({ active: { $ne: false } });
  next();
});
userSchema.methods.correctPassword = async function (
  canidatePassword,
  userPassword
) {
  return await bcrypt.compare(userPassword, canidatePassword);
};
userSchema.methods.changePasswordAfter = function (jwtIAT) {
  const user = this;
  const time = Math.floor(user.changePasswordAt / 1000);
  console.log(time, jwtIAT);

  if (time > jwtIAT) return true;
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
