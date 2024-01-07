const Card = require('../models/Card');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const Forbidden = require('../errors/forbidden');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  Card.create({
    name: req.body.name,
    link: req.body.link,
    owner: req.user._id,
  })
    .then((card) => {
      if (!card) {
        throw new ValidationError('Переданы некорректные данные при создании карточки');
      }
      res.status(201).send({ data: card });
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      if (card.owner !== req.user._id) {
        throw new Forbidden('Вы не можете удалить эту карточку');
      }
      Card.deleteOne(card);
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.status(200).send({ data: card });
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true })
    .orFail()
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.status(200).send({ data: card });
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true })
    .orFail()
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.status(200).send({ data: card });
    })
    .catch(next);
};






/*
  const Card = require('../models/Card');
const NotFoundError = require('./errors/not-found-err');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  Card.create({
    name: req.body.name,
    link: req.body.link,
    owner: req.user._id
  })
    .then(card => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' })
      } else {
        res.status(500).send({ message: 'Произошла ошибка' })
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const owner = req.params.owner._id;
  const cardOwner = req.user._id;
  if (owner !== cardOwner) {
    return res.status(403).send({ error: 'Вы не можете удалить эту карточку' });
  }
  Card.findByIdAndRemove(req.params.id)
    .orFail()
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({ message: 'Карточка не найдена' })
      } else {
        res.status(500).send({ message: 'Произошла ошибка' })
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true, runValidators: true })
    .orFail()
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({ message: 'Карточка не найдена' })
      } if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка' })
      } else {
        res.status(500).send({ message: 'Произошла ошибка' })
      }
    });
  };

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true, runValidators: true })
    .orFail()
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({ message: 'Карточка не найдена' })
      } if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка' })
      } else {
        res.status(500).send({ message: 'Произошла ошибка' })
      }
    });
  };*/