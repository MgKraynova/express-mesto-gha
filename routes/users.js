const routerUsers = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getAllUsers, getUserById, updateUser, updateUserAvatar, getCurrentUserInfo,
} = require('../controllers/users');

routerUsers.get('/me', getCurrentUserInfo);

routerUsers.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

routerUsers.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
}), updateUserAvatar);

routerUsers.get('/:userId', getUserById);

routerUsers.get('/', getAllUsers);

module.exports = routerUsers;
