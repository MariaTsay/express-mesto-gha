const router = require('express').Router();
const auth = require('../middlewares/auth');
const NotFound = require('../errors/NotFound');

const userRouter = require('./users');
const cardRouter = require('./cards');
const authRouter = require('./auth');

const pageNotFound = (req, res, next) => {
  next(new NotFound('Страница не найдена'));
};

router.use('/', authRouter);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', pageNotFound);

module.exports = router;
