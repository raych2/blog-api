const express = require('express');
const router = express.Router();

const post_controller = require('../controllers/postController');
const user_controller = require('../controllers/userController');
const comment_controller = require('../controllers/commentController');

//sign up user on blog editor
router.post('/signup', user_controller.user_signup);

module.exports = router;
