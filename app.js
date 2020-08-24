/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { auth } = require('./middlewares/auth');
const { createUser, login } = require('./controllers/auth');
require('dotenv').config();

const { PORT = 3000 } = process.env;

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 40, // можно совершить максимум 40 запросов с одного IP
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const logger = (req, res, next) => {
  console.log('Путь — ', req.path);
  next();
};

app.use(logger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(limiter);
app.use(helmet());
app.use(cookieParser());

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res
    .status(404)
    .send({ message: 'Запрашиваемый ресурс не найден!' });
});

app.listen(PORT, () => {
  console.log(`Порт: ${PORT}`);
});
