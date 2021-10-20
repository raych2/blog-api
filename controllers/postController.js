const Post = require('../models/Post');
const { body, validationResult } = require('express-validator');

exports.index = (req, res) => {
  res.redirect('/posts');
};

exports.post_list = async (req, res) => {
  const posts = await Post.find({})
    .sort('-createdAt')
    .populate('author')
    .exec()
    .catch((err) => {
      res.status(500).json({ err });
      throw err;
    });
  if (!posts) {
    return res.status(400).json({ message: 'There are no posts available' });
  }
  return res.status(200).json({
    posts,
    message: 'All posts successfully accessed',
  });
};

exports.create_post = [
  body('title', 'Title must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('text', 'Text must not be empty.').trim().isLength({ min: 1 }).escape(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ post: req.body, errors: errors.array() });
    }
    const post = new Post({
      title: req.body.title,
      author: req.user._id,
      text: req.body.text,
      published: false,
      comments: [],
      timestamps: true,
    });
    const newPost = await post.save().catch((err) => {
      res.status(500).json({ message: 'Post creation failed' });
      throw err;
    });
    res.status(200).json({ message: 'New post successfully created', post: newPost });
  },
];
