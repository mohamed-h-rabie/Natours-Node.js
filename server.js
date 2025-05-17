const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });
const port = process.env.PORT || 3000;
const app = require('./app');
const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
);
mongoose.connect(DB).then(console.log('connectedd successfully with DB'));

app.listen(port, () => {
  console.log(`server is running in port ${port}`);
  
});
