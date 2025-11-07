const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');

exports.getCheckoutSession = async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);
  console.log(req.get('host'));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/?user=${
      req.user.id
    }&tour=${req.params.tourId}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
          },
          unit_amount: tour.price * 100,
        },
        quantity: 1,
      },
    ],
  });
  console.log(session);

  res.status(200).json({
    message: 'success',
    session,
  });
};

exports.createBooking = async (req, res, next) => {
  const { price, tour, user } = req.query;
  if (!price && !tour && !user) next();
  await Booking.create({ price, tour, user });
  console.log(req.originalUrl.split('?')[0]);

  res.redirect(req.originalUrl.split('?')[0]);
};
