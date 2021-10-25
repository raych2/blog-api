const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.user_signup = [
  body('username', 'Username required')
    .trim()
    .isLength({ min: 1 })
    .custom((value) => {
      return User.find({ username: value }).then((user) => {
        if (user.length > 0) {
          return Promise.reject(
            'Username already in use. Please choose another username.'
          );
        }
      });
    })
    .escape(),
  body('password', 'Password required').trim().isLength({ min: 6 }).escape(),

  async (req, res) => {
    try {
      const user = new User({
        username: req.body.username,
        password: req.body.password,
      });
      const result = await user.save();
      res.json({ message: 'Signup successful', user: result });
    } catch (error) {
      res.status(500).send(error);
    }
  },
];

exports.user_login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }).exec();
    if (!user) {
      res.status(400).json({ message: 'The username does not exist' });
    }
    const validPassword = await user.validatePassword(
      req.body.password,
      (error, match) => {
        if (!match) {
          res.status(401).json({ message: 'The password is invalid' });
        }
      }
    );
    if (validPassword) {
      const secret = process.env.SECRET;
      const token = jwt.sign({ user: user }, secret, { expiresIn: '1d' });
      res.status(200).json({ message: 'Auth Passed', token });
    }
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};
