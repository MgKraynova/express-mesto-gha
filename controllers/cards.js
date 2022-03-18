const Card = require('../models/card');

module.exports.getAllCards = (req, res) => {
  Card.find({}).select('-__v')
    .then((result) => res.send(result))
    .catch((err) => {
      res.status(500).send({ message: `На сервере произошла ошибка: ${err}` });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Ошибка. При создании карточки были переданы некорректные данные' });
        return;
      }
      res.status(500).send({ message: `На сервере произошла ошибка: ${err}` });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId).select('-__v')
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        res.status(404).send({ message: 'Ошибка. Карточка не найдена, попробуйте еще раз' });
      }
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Ошибка. Карточка не найдена, попробуйте еще раз' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Ошибка. Введен некорректный id карточки' });
        return;
      }
      res.status(500).send({ message: `На сервере произошла ошибка: ${err}` });
    });
};

module.exports.likeCard = (req, res) => {
  console.log('req.user._id', req.user._id);
  console.log('req.params.cardId', req.params.cardId);
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).select('-__v')
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        res.status(404).send({ message: 'Ошибка. Карточка не найдена, попробуйте еще раз' });
      }
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Ошибка. Карточка не найдена, попробуйте еще раз' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Ошибка. Введен некорректный id карточки' });
        return;
      }
      res.status(500).send({ message: `На сервере произошла ошибка: ${err}` });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).select('-__v')
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        res.status(404).send({ message: 'Ошибка. Карточка не найдена, попробуйте еще раз' });
      }
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Ошибка. Карточка не найдена, попробуйте еще раз' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Ошибка. Введен некорректный id карточки' });
        return;
      }
      res.status(500).send({ message: `На сервере произошла ошибка: ${err}` });
    });
};
