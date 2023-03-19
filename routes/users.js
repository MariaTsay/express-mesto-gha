const router = require('express').Router();

const { Joi, celebrate, errors } = require('celebrate');
const {
  getUsers, getUserId, getCurrentUser, updateUser, updateAvatar,
} = require('../controllers/users');

const patternURL = require('../config/config');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUserId);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(patternURL),
  }),
}), updateAvatar);

router.use(errors());

module.exports = router;
