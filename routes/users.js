const routerUsers = require('express').Router();
const {
  getAllUsers, getUserById, createUser, updateUser, updateUserAvatar,
} = require('../controllers/users');

routerUsers.get('/', getAllUsers);

routerUsers.get('/:userId', getUserById);

routerUsers.post('/', createUser);

routerUsers.patch('/me', updateUser);

routerUsers.patch('/me/avatar', updateUserAvatar);

module.exports = routerUsers;
