const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createUser = (req, res) => {
  const { email, password, name, about, avatar } = req.body;

  bcrypt.hash(password, 10)
    .then(hash => User.create({
      email,
      password: hash,
      name,
      about,
      avatar
    }))
    .then(user => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' })
      } else {
        res.status(500).send({ message: 'Произошла ошибка' })
      }
    });
};

// send cookie after authentication
module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' }
      );

      res
        .cookie('jwt', token, {
          maxAge: 604800000,
          httpOnly: true
        })
        .end();
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .orFail()
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' })
      } if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({ message: 'Пользователь не найден' })
      } else {
        res.status(500).send({ message: 'Произошла ошибка' })
      }
    });
};

/*
module.exports.getUserData = (req, res) => {
  //send request for info
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'some answer' })
      } if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({ message: 'some answer' })
      } else {
        res.status(500).send({ message: 'Произошла ошибка' })
      }
    });
};
*/

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.params.id, { name: name, about: about }, { new: true, runValidators: true  })
    .orFail()
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

  User.findByIdAndUpdate(req.params.id, { avatar: avatar }, { new: true, runValidators: true })
    .orFail()
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
