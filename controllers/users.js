const User = require('../models/user');

module.exports.getAllUsers = (req, res) => {
  User.find({}).select('-__v')
    .then((result) => res.send(result))
    .catch((err) => {
      res.status(500).send({ message: `На сервере произошла ошибка: ${err}` });
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
        res.status(404).send({ message: 'Ошибка. Пользователь не найден, попробуйте еще раз' });
      }
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Ошибка. Пользователь не найден, попробуйте еще раз' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Ошибка. Введен некорректный id пользователя' });
        return;
      }
      res.status(500).send({ message: `На сервере произошла ошибка: ${err}` });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Ошибка. При создании пользователя были переданы некорректные данные' });
        return;
      }
      res.status(500).send({ message: `На сервере произошла ошибка: ${err}` });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  ).select('-__v')
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        res.status(404).send({ message: 'Ошибка. Пользователь не найден, попробуйте еще раз' });
      }
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Ошибка. Пользователь не найден, попробуйте еще раз' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Ошибка. Введен некорректный id пользователя' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Ошибка. При обновлении данных пользователя были переданы некорректные данные' });
        return;
      }
      res.status(500).send({ message: `На сервере произошла ошибка: ${err}` });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  ).select('-__v')
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        res.status(404).send({ message: 'Ошибка. Пользователь не найден, попробуйте еще раз' });
      }
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Ошибка. Пользователь не найден, попробуйте еще раз' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Ошибка. Переданы некорректные данные' });
        return;
      }
      res.status(500).send({ message: `На сервере произошла ошибка: ${err}` });
    });
};
