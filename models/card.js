
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    default: '',
    required: {
      value: true,
      message: 'Это обязательное поле'},
    minlength: [2, 'Минимальная длина 2 символа'],
    maxlength: [30, 'Максимальная длина 30 символов']
  },
  link: {
    type: String,
    default: '',
    required: {
      value: true,
      message: "Это обязательное поле"},
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    default: ''
  }],
  createdAt: [{
    type: Date,
    default: Date.now
  }],
});

module.exports = mongoose.model('card', cardSchema);