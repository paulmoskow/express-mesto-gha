const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send({ data: cards }))
    .catch(() => res.status(404).send({ message: 'Произошла ошибка' }));
};


module.exports.createCard = (req, res) => {

  console.log(req.user._id);

  const { name, link } = req.body;

  Card.create({ name, link })
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' })
      } else {
        res.status(500).send({ message: 'Произошла ошибка' })
      }
    });
};
/////////////////////////////////////////////////

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({ message: 'Карточка не найдена' })
      }
    });
  };

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
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
  Card.findByIdAndRemove(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
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