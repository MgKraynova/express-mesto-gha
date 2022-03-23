const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const CastError = require('../errors/CastError');
const ValidationError = require('../errors/ValidationError');

module.exports.getAllCards = (req, res, next) => {
  Card.find({}).select('-__v')
    .then((result) => res.send(result))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Ошибка. При создании карточки были переданы некорректные данные');
      }
      next();
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId).select('-__v')
    .then((result) => {
      const cardOwner = result.owner.toString().replace('new ObjectId("', '');
      if (req.user._id === cardOwner) {
        Card.findByIdAndRemove(req.params.cardId).select('-__v')
          .then((card) => {
            if (card) {
              res.send({ data: card });
            } else {
              throw new NotFoundError('Ошибка. Карточка не найдена, попробуйте еще раз');
            }
          })
          .catch((err) => {
            if (err.name === 'DocumentNotFoundError') {
              throw new NotFoundError('Ошибка. Карточка не найдена, попробуйте еще раз');
            }
            if (err.name === 'CastError') {
              throw new CastError('Ошибка. Введен некорректный id карточки');
            }
            next();
          })
          .catch(next);
      } else {
        res.status(403).send({ message: 'Отстутствуют права на удаление чужой карточки' });
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).select('-__v')
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        throw new NotFoundError('Ошибка. Карточка не найдена, попробуйте еще раз');
      }
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Ошибка. Карточка не найдена, попробуйте еще раз');
      }
      if (err.name === 'CastError') {
        throw new CastError('Ошибка. Введен некорректный id карточки');
      }
      next();
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).select('-__v')
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        throw new NotFoundError('Ошибка. Карточка не найдена, попробуйте еще раз');
      }
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Ошибка. Карточка не найдена, попробуйте еще раз');
      }
      if (err.name === 'CastError') {
        throw new CastError('Ошибка. Введен некорректный id карточки');
      }
      next();
    })
    .catch(next);
};
