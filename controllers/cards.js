const http2 = require('http2');
const { default: mongoose } = require('mongoose');

const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');
const Card = require('../models/card');

const {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = http2.constants;

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((newCard) => res.status(201).send(newCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные для создания карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  if (!mongoose.isValidObjectId(cardId)) {
    throw new BadRequest('Переданы некорректные данные');
  }

  Card.findByIdAndDelete(cardId)
    .orFail(() => {
      throw new NotFound('Карточка с указанным  _id не найдена');
    })
    .then((card) => {
      const owner = card.owner.toString();
      if (req.user._id === owner) {
        res.status(200).send(card);
      } else {
        throw new Forbidden('Вы можете удалять только свои карточки');
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res) => {
  if (!mongoose.isValidObjectId(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )) {
    res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
    return;
  }

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным  _id не найдена' }))
    .then((card) => res.status(200).send(card))
    .catch(() => res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

module.exports.dislikeCard = (req, res) => {
  if (!mongoose.isValidObjectId(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )) {
    res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
    return;
  }

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным  _id не найдена' }))
    .then((card) => res.status(200).send(card))
    .catch(() => res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};
