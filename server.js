const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const port = process.env.PORT || 3000
const app = require('./app');

app.listen(port, () => {
  console.log(`server is running in port ${port}`);
  console.log(`Access the app at http://192.168.1.2:${port}`);
});
