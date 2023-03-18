const router = require('express').Router();

const {
  getUsers, getUserId, getCurrentUser, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', getUserId);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
