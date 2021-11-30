const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('../auth/auth');

const post_controller = require('../controllers/postController');
const user_controller = require('../controllers/userController');
const comment_controller = require('../controllers/commentController');

router.get('/', post_controller.index);
router.get('/posts', post_controller.post_list);

router.post('/signup', user_controller.user_signup);
router.post('/login', user_controller.user_login);

router.post(
  '/posts',
  passport.authenticate('jwt', { session: false }),
  post_controller.create_post
);
router.get('/posts/:postId', post_controller.post_detail);
router.post('/posts/:postId/comments', comment_controller.add_comment);
router.put(
  '/posts/:postId',
  passport.authenticate('jwt', { session: false }),
  post_controller.update_post
);
router.put(
  '/posts/:postId',
  passport.authenticate('jwt', { session: false }),
  post_controller.publish_post
);
router.delete(
  '/posts/:postId',
  passport.authenticate('jwt', { session: false }),
  post_controller.delete_post
);
router.delete(
  '/posts/:postId/comments/:commentId',
  passport.authenticate('jwt', { session: false }),
  comment_controller.delete_comment
);

module.exports = router;
