const routerCards = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

routerCards.get('/', getAllCards);

routerCards.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().regex(/https?:\/\/(www)?(\.)?[0-9а-яa-zё]{1,}\.[а-яa-zё]{2}[a-zа-яё\-._~:/?#[]@!$&'\(\)\*\+,;=]*#?/i),
  }),
}), createCard);

routerCards.delete('/:cardId', deleteCard);

routerCards.put('/:cardId/likes', likeCard);

routerCards.delete('/:cardId/likes', dislikeCard);

module.exports = routerCards;
