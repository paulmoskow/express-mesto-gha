const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const SOLT_ROUND = 10;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(201).send({ data: users }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name, about, avatar } = req.body;

  bcrypt.hash(password, SOLT_ROUND)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      if (!user) {
        throw new ValidationError('Переданы некорректные данные при создании пользователя');
      }
      res.status(201).send({ data: user });
    })
    .catch((err) => {
      if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        return res.status(409).send({ message: 'Такой пользователь уже зарегистрирован' });
      }
      next(err);
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
        { expiresIn: '7d' },
      );

      res
        .cookie('jwt', token, {
          maxAge: 604800000,
          httpOnly: true,
        })
        .end();
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .orFail()
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      try {
        res.status(201).send({ data: user });
      } catch (err) {
        if (err instanceof ValidationError) {
          throw new ValidationError('Переданы некорректные данные при создании пользователя');
        }
      }
    })
    .catch(next);
};

module.exports.getUserData = (req, res, next) => {
  const { email } = req.body;

  User.findOne({ email })
    .orFail()
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      try {
        res.status(201).send({ data: user });
      } catch (err) {
        if (err instanceof ValidationError) {
          throw new ValidationError('Переданы некорректные данные при создании пользователя');
        }
      }
    })
    .catch(next);
};

module.exports.updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.params.id,
    { name: name, about: about },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      try {
        res.status(201).send({ data: user });
      } catch (err) {
        if (err instanceof ValidationError) {
          throw new ValidationError('Переданы некорректные данные при создании пользователя');
        }
      }
    })
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.params.id, { avatar: avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      try {
        res.status(201).send({ data: user });
      } catch (err) {
        if (err instanceof ValidationError) {
          throw new ValidationError('Переданы некорректные данные при создании пользователя');
        }
      }
    })
    .catch(next);
};



/*const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const SOLT_ROUND = 10;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createUser = (req, res) => {
  const { email, password, name, about, avatar } = req.body;

  bcrypt.hash(password, SOLT_ROUND)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar
    }))
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' })
      } if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        return res.status(409).send({ message: 'Такой пользователь уже зарегистрирован' })
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
    .then((user) => res.send({ data: user }))
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

module.exports.getUserData = (req, res) => {
  const { email } = req.body;

  User.findOne({ email })
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' })
      } if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({ message: 'Пользователь не найден' })
      } else {
        res.status(500).send({ message: 'Произошла ошибка' })
      }
    });
};

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.params.id,
    { name: name, about: about },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.send({ data: user }))
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
    .then((user) => res.send({ data: user }))
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
*/