const dotenv = require('dotenv');
const mongoose = require('mongoose');
const tour = require('../../models/tourModel');
const fs = require('fs');
dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
);
mongoose.connect(DB).then(console.log('connectedd successfully with DB'));
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`),
  'utf-8',
);
const addData = async () => {
  try {
    console.log('add');

    await tour.create(tours);
  } catch (error) {
    console.log(error);
  } finally {
    process.exit();
  }
};
const deleteData = async () => {
  try {
    await tour.deleteMany();
  } catch (error) {
    console.log(error);
  } finally {
    process.exit();
  }
};
if (process.argv[2] === '--delete') {
  deleteData();
} else {
  addData();
}
console.log(process.argv);
