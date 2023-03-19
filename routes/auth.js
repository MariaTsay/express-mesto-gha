const router = require('express').Router();

const { Joi, celebrate, errors } = require('celebrate');
const {
  login, createUser,
} = require('../controllers/users');

const patternURL = require('../config/config');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(patternURL),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

router.use(errors());

module.exports = router;
