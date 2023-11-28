/* Заведите в нём express-сервер и настройте его запуск на 3000 порту по команде: npm run start */

const express = require('express');
const mongoose = require('mongoose');
const router = require('express').Router();
const json = require('express').json();
const userRouter = require('./routes/users.js');
const cardRouter = require('./routes/cards.js');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(json);

router.use('/users', userRouter);
router.use('/cards', cardRouter);

app.use((req, res, next) => {
  req.user = {
    _id: '6565f62fb7d05e2a4095fc51'
  };

  next();
});

app.use(router);


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})