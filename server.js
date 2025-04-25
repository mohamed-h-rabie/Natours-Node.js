const app = require('./app');
const port = 3000;

app.listen(port, () => {
  console.log(`server is running in port ${port}`);
  console.log(`Access the app at http://192.168.1.2:${port}`);
});
