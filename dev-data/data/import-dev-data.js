const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`),
  'utf-8'
);
const Tour = require('../../models/tourModel');
mongoose
  .connect(process.env.DATABASE_LOCAL)
  .then(console.log('connectedd successfully with DB'));

const importData = async (req, res) => {
  try {
    await Tour.create(tours);
  } catch (error) {
    console.log(error);
  } finally {
    process.exit();
  }
};
const deleteData = async (req, res) => {
  try {
    await Tour.deleteMany();
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
