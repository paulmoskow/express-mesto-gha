const express = require('express');
const mongoose = require('mongoose');
const router = require('express').Router();
const json = require('express').json();
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(json);

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', (req, res) => {
  res.status(404).send({ message: 'Некорректный роут' })
})

/*app.use((req, res, next) => {
  req.user = {
    _id: '6565f62fb7d05e2a4095fc51'
  };

  next();
});*/

app.use(router);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
});
