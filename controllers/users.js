const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports.getAllUsers = (req, res) => {
  User.find({}).select('-__v')
    .then((result) => res.send(result))
    .catch((err) => {
      res.status(500).send({message: `На сервере произошла ошибка: ${err}`});
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      Error('Ошибка. Пользователь не найден, попробуйте еще раз');
    }).select('-__v')
    .then((result) => {
      if (result) {
        res.send(result);
      } else {
        res.status(404).send({message: 'Ошибка. Пользователь не найден, попробуйте еще раз'});
      }
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({message: 'Ошибка. Пользователь не найден, попробуйте еще раз'});
        return;
      }
      if (err.name === 'CastError') {
        res.status(400).send({message: 'Ошибка. Введен некорректный id пользователя'});
        return;
      }
      res.status(500).send({message: `На сервере произошла ошибка: ${err}`});
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  User.find({ email })
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
                  res.status(400).send({message: 'Ошибка. При создании пользователя были переданы некорректные данные'});
                  return;
                }
                res.status(500).send({message: `На сервере произошла ошибка: ${err}`});
              });
          });
      } else {
        res.status(409).send({message: 'Ошибка. Пользователь c таким email уже зарегистрирован'});
      }
    });
};

module.exports.updateUser = (req, res) => {
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
        res.status(404).send({message: 'Ошибка. Пользователь не найден, попробуйте еще раз'});
      }
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({message: 'Ошибка. Пользователь не найден, попробуйте еще раз'});
        return;
      }
      if (err.name === 'CastError') {
        res.status(404).send({message: 'Ошибка. Введен некорректный id пользователя'});
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(400).send({message: 'Ошибка. При обновлении данных пользователя были переданы некорректные данные'});
        return;
      }
      res.status(500).send({message: `На сервере произошла ошибка: ${err}`});
    });
};

module.exports.updateUserAvatar = (req, res) => {
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
        res.status(404).send({message: 'Ошибка. Пользователь не найден, попробуйте еще раз'});
      }
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({message: 'Ошибка. Пользователь не найден, попробуйте еще раз'});
        return;
      }
      if (err.name === 'CastError') {
        res.status(404).send({message: 'Ошибка. Переданы некорректные данные'});
        return;
      }
      res.status(500).send({message: `На сервере произошла ошибка: ${err}`});
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(() => {
      res.status(401).send({ message: 'Почта или пароль введены неправильно' });
    });
};

module.exports.getCurrentUserInfo = (req, res) => {
  const userId = req.user._id;
  User.findOne({ _id: userId }).select('-__v')
    .then((user) => {
      if (user) {
        res.send({data: user});
      } else {
        res.status(404).send({message: 'Ошибка. Пользователь не найден, попробуйте еще раз'});
      }
    })
    .catch((err) => {
      res.status(500).send({message: `На сервере произошла ошибка: ${err}`});
    }); //todo улучшить обработку ошибок
};
