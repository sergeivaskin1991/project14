/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const auth = require('./middlewares/auth');
const { register } = require('./controllers/auth');
const { login } = require('./controllers/users');
const rateLimit = require('express-rate-limit');

const { PORT = 3000 } = process.env;

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100 // можно совершить максимум 100 запросов с одного IP
});
const helmet = require('helmet');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const logger = (req, res, next) => {
  console.log('Запрашиваемый путь — ', req.path);
  next();
};

app.use(limiter);
app.use(helmet());
app.use(logger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', register);
app.post('/signin', login);

app.use(auth);

app.use('/cards', require('./routes/cards'));
app.use('/users', require('./routes/users'));

app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден!' });
});

app.listen(PORT, () => {
  console.log(`Порт: ${PORT}`);
});
