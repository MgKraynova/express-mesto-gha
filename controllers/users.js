const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const CastError = require('../errors/CastError');
const ValidationError = require('../errors/ValidationError');
const ConflictingRequest = require('../errors/ConflictingRequest');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports.getAllUsers = (req, res, next) => {
  User.find({}).select('-__v')
    .then((result) => res.send(result))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      Error('Ошибка. Пользователь не найден, попробуйте еще раз');
    }).select('-__v')
    .then((result) => {
      if (result) {
        res.send(result);
      } else {
        throw new NotFoundError('Ошибка. Пользователь не найден, попробуйте еще раз');
      }
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Ошибка. Пользователь не найден, попробуйте еще раз');
      }
      if (err.name === 'CastError') {
        throw new CastError('Ошибка. Введен некорректный id пользователя');
      }
      next();
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  User.find({email})
    .then((response) => {
      if (response.length === 0) {
        bcrypt.hash(password, 10)
          .then((hash) => {
            User.create({
              name, about, avatar, email, password: hash,
            })
              .then((user) => res.send({data: user}))
              .catch((err) => {
                if (err.name === 'ValidationError') {
                  throw new ValidationError('Ошибка. При создании пользователя были переданы некорректные данные');
                }
                next();
              })
              .catch(next);
          });
      } else {
        throw new ConflictingRequest('Ошибка. Пользователь c таким email уже зарегистрирован');
      }
    })
    .catch(next);
};


module.exports.updateUser = (req, res, next) => {
  const {name, about} = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    {name, about},
    {new: true, runValidators: true},
  ).select('-__v')
    .then((user) => {
      if (user) {
        res.send({data: user});
      } else {
        throw new NotFoundError('Ошибка. Пользователь не найден, попробуйте еще раз');
      }
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Ошибка. Пользователь не найден, попробуйте еще раз');
      }
      if (err.name === 'CastError') {
        throw new CastError('Ошибка. Введен некорректный id пользователя');
      }
      if (err.name === 'ValidationError') {
        throw new ValidationError('Ошибка. При обновлении данных пользователя были переданы некорректные данные');
      }
      next();
    })
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const {avatar} = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    {avatar},
    {new: true, runValidators: true},
  ).select('-__v')
    .then((user) => {
      if (user) {
        res.send({data: user});
      } else {
        throw new NotFoundError('Ошибка. Пользователь не найден, попробуйте еще раз');
      }
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Ошибка. Пользователь не найден, попробуйте еще раз');
      }
      if (err.name === 'CastError') {
        throw new CastError('Ошибка. Переданы некорректные данные');
      }
      next();
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const {email, password} = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        {_id: user._id},
        'some-secret-key',
        {expiresIn: '7d'},
      );
      res.send({token});
    })
    .catch(() => {
      throw new UnauthorizedError('Почта или пароль введены неправильно');
    })
    .catch(next);
};

module.exports.getCurrentUserInfo = (req, res, next) => {
  const userId = req.user._id;
  User.findOne({_id: userId}).select('-__v')
    .then((user) => {
      if (user) {
        res.send({data: user});
      } else {
        throw new NotFoundError('Ошибка. Пользователь не найден, попробуйте еще раз');
      }
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Ошибка. Пользователь не найден, попробуйте еще раз');
      }
      if (err.name === 'CastError') {
        throw new CastError('Ошибка. Переданы некорректные данные');
      }
      next();
    })
    .catch(next);
};
