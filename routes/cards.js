const routerCards = require('express').Router();
const {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

routerCards.get('/', getAllCards);

routerCards.post('/', createCard);

routerCards.delete('/:cardId', deleteCard);

routerCards.put('/:cardId/likes', likeCard);

routerCards.delete('/:cardId/likes', dislikeCard);

module.exports = routerCards;
