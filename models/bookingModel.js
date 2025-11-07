const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A Booking Must have an user'],
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'A Booking Must have an tour'],
  },
  price: {
    type: Number,
    required: [true, 'A Booking Must have an price'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});
bookingSchema.pre(/^find/, function (next) {
  const booking = this;
  booking.populate('user').populate({ path: 'tour', select: 'name' });
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
