const User = require('../models/user');

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((result) => res.send(result))
    .catch((err) => {
      res.status(500).send({ message: `Ошибка ${err}` });
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({ message: `Ошибка ${err}` });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      res.status(500).send({ message: `Ошибка ${err}` });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      res.status(500).send({ message: `Ошибка ${err}` });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      res.status(500).send({ message: `Ошибка ${err}` });
    });
};