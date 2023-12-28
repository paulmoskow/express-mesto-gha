const Card = require('../models/card');

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
  };