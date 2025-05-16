const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'the tour should has a name'],
    unique: true 
  },
  price: {
    type: Number,
    required: [true, 'the tour should has a price'],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
});
const tour = mongoose.model('Tour', tourSchema);

module.exports = tour;
