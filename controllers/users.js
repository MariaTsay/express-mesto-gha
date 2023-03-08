const { default: mongoose } = require('mongoose');
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUserId = (req, res) => {
  const { userId } = req.params;
  if (!mongoose.isValidObjectId(userId)) {
    res.status(400).send({ message: 'Переданы некорректные данные' });
  }

  User.findById(userId)
    .orFail(() => res.status(404).send({ message: 'Пользователь с указанным _id не найден' }))
    .then((user) => res.status(200).send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((newUser) => res.status(200).send({ data: newUser }))
    .catch(() => res.status(400).send({ message: 'Переданы некорректные данные пользователя' }));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => res.status(404).send({ message: 'Пользователь с указанным _id не найден' }))
    .then((updatedUser) => res.status(200).send(updatedUser))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: 'Переданы некорректные данные пользователя' });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .orFail(() => res.status(404).send({ message: 'Пользователь с указанным _id не найден' }))
    .then((updatedAvatar) => res.status(200).send(updatedAvatar))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};
