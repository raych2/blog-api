const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('../auth/auth');

const post_controller = require('../controllers/postController');
const user_controller = require('../controllers/userController');
const comment_controller = require('../controllers/commentController');

//sign up user on blog editor
router.post('/signup', user_controller.user_signup);
//log in user on blog editor
router.post('/login', user_controller.user_login);

module.exports = router;
