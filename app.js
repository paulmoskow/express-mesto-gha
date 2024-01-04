const express = require('express');
const mongoose = require('mongoose');
const router = require('express').Router();
const json = require('express').json();
const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

app.use(cookieParser());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(json);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    title: Joi.string().required().min(2).max(30),
    text: Joi.string().required().min(2),
  }).unknown(true),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    title: Joi.string().required().min(2).max(30),
    text: Joi.string().required().min(2),
  }).unknown(true),
}), createUser);

router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);
router.use('*', (req, res) => {
  res.status(404).send({ message: 'Некорректный роут' })
});

app.use(router);

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Произошла ошибка'
        : message
    });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
});
