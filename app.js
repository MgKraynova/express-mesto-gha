const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
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
    _id: '62320672921704468e5ed5bf', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', routerUsers);
app.use('/cards', routerCards);


// {"_id":{"$oid":"62320672921704468e5ed5bf"},
