const routerUsers = require('express').Router();
const {
  getAllUsers, getUserById, updateUser, updateUserAvatar, getCurrentUserInfo,
} = require('../controllers/users');

routerUsers.get('/me', getCurrentUserInfo);
routerUsers.patch('/me', updateUser);
routerUsers.patch('/me/avatar', updateUserAvatar);
routerUsers.get('/:userId', getUserById);
routerUsers.get('/', getAllUsers);

module.exports = routerUsers;
