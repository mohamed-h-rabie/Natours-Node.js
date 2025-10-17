const mongoose = require('mongoose');
const dotenv = require('dotenv');
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message, `asdsa`);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const port = process.env.PORT;

const db = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(process.env.DATABASE_LOCAL)
  .then(console.log('connected with db'));
// .catch((err) => console.log(`Error :${err}`));

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  server.close(() => {
    console.log(err.name, err.message, `hello`);
    process.exit(1);
  });
});
// console.log(x);
