const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

app.use((req, res, next) => {
  req.user = {
    _id: '62320672921704468e5ed5bf',
  };

  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', routerUsers);
app.use('/cards', routerCards);

app.use((req, res, next) => {
  res.status(404).send({ message: 'Ошибка 404. Запрашиваемые вами данные не найдены.' });
  next();
});

app.use((err, req, res, next) => {
  res.status(500).send(`На сервере произошла ошибка: ${err.name}: ${err.message}`);
  next();
});

process.on('uncaughtException', function (err) {
  console.error(err.stack);
  console.log('Node NOT Exiting...');
});