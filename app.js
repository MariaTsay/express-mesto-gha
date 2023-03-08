const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

const app = express();

const { PORT = 3000 } = process.env;
mongoose
  .connect('mongodb://localhost:27017/mestodb')
  .then(() => {
    console.log('connect');
  })
  .catch((err) => {
    console.log(`error during connection ${err}`);
  });

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '640369a5a95dca3649528800',
  };

  next();
});

app.use('/', router);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
