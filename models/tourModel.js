const mongoose = require('mongoose');
const slugify = require('slugify');
const { findById } = require('./userModel');
const User = require('../models/userModel');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      minlength: [5, 'the name must be more than or equal 5'],
      maxlength: [40, 'the name must be lower than or equal 40'],
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          return this.price > value;
        },
        message: 'priceDiscount should be less than price',
      },
    },

    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a groupSize'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'the diffcultty must be easy,medium,difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'rating must be more than 1'],
      max: [5, 'rating must be lower than 5'],
    },
    ratingsQuantity: {
      type: Number,
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a imageCover'],
    },
    secreteTour: {
      type: Boolean,
      default: false,
      select: false,
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      // select: false,
    },
    startDates: [Date],
    slug: String,
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      description: String,
      address: String,
      coordinates: [Number],
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        description: String,
        address: String,
        coordinates: [String],
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  { toJSON: { virtuals: true }, toObject: { virtual: true } }
);
tourSchema.index({ price: -1 });
tourSchema.index({ startLocation: '2dsphere' });
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'tour',
});

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));

//   this.guides = await Promise.all(guidesPromises);
//   next();
// });
// tourSchema.pre('find', function (next) {
tourSchema.pre(/^find/, function (next) {
  this.find({ secreteTour: { $ne: true } });
  this.start = Date.now();
  next();
});
tourSchema.pre(/^find/, function (next) {
  const tours = this;
  tours.populate({ path: 'guides', select: '-_id -__v -passwordChangedAt' });
  next();
});
// tourSchema.pre('aggregate', function (next) {
//   // this.match({ secreteTour: { $ne: true } });
//   this.pipeline().unshift({ $match: { secreteTour: { $ne: true } } });

//   next();
// });

// tourSchema.post(/^find/, function (doc, next) {
//   console.log('finally find document');
//   console.log(`finding module take ${Date.now()-this.start} ms`);

//   next();
// });
// tourSchema.pre('save', function (next) {
//   console.log('Saving Document....');
//   next();
// });
// tourSchema.post('save', function (doc, next) {
//   setTimeout(() => {
//     console.log(doc);
//   }, 3000);
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
