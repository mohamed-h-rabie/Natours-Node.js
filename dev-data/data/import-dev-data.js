const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`), 'utf-8');
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`), 'utf-8');
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`),
  'utf-8'
);
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');
mongoose
  .connect(process.env.DATABASE_LOCAL)
  .then(console.log('connectedd successfully with DB'));

const importData = async (req, res) => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    // await Review.create(reviews, { validateBeforeSave: false });
  } catch (error) {
    console.log(error);
  } finally {
    process.exit();
  }
};
const deleteData = async (req, res) => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
  } catch (error) {
    console.log(error);
  } finally {
    process.exit();
  }
};

console.log(process.argv);

if (process.argv[2] === '--import') {
  importData();
} else {
  deleteData();
}
