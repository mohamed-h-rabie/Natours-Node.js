const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const port = process.env.PORT;
const db = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(process.env.DATABASE_LOCAL)
  .then(console.log('connected with db'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
