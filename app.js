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

app.use('/', router);

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;
  console.log(err);

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
