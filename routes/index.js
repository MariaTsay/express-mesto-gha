const router = require('express').Router();
const http2 = require('http2');

const {
  HTTP_STATUS_NOT_FOUND,
} = http2.constants;

const userRouter = require('./users');
const cardRouter = require('./cards');

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', (req, res) => {
  res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Страница не найдена' });
});

module.exports = router;
