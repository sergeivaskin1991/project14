const bcrypt = require('bcryptjs');
const User = require('../models/user');

module.exports.register = (req, res) => {
  User.findOne({ email }).select('+password')
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      res.status(201).send({
        _id: user._id,
        email: user.email,
      });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};
