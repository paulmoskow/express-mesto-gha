const User = require('../models/User');


module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};


module.exports.createUser = (req, res) => {

  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' })
      } else {
        res.status(500).send({ message: 'Произошла ошибка' })
      }
    });
};
/////////////////////////////////////////////////

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({ message: 'Пользователь не найден' })
      } else {
        res.status(500).send({ message: 'Произошла ошибка' })
      }
    });
};

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.params.id, { name: name, about: about }, { new: true })
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({ message: 'Пользователь не найден' })
      } if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' })
      } else {
        res.status(500).send({ message: 'Произошла ошибка' })
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.params.id, { avatar: avatar }, { new: true })
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({ message: 'Пользователь не найден' })
      } if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' })
      } else {
        res.status(500).send({ message: 'Произошла ошибка' })
      }
    });
};