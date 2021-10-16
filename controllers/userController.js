const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
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
