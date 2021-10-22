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
    res
      .status(200)
      .json({ message: 'New post successfully created', post: newPost });
  },
];

exports.post_detail = async (req, res) => {
  const post = await Post.findById(req.params.postId)
    .exec()
    .catch((err) => {
      res.status(500).json({ err });
      throw err;
    });
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }
  res.status(200).json({ post });
};

exports.delete_post = async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.postId).catch((err) => {
    res.status(500).json({ err });
    throw err;
  });
  res.status(200).json({ message: 'Post successfully deleted' });
};

exports.update_post = [
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
    const { title, text } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(req.params.postId, {
      title,
      text,
    }).catch((err) => {
      res.status(500).json({ message: 'Post update failed' });
      throw err;
    });
    res.status(200).json({ message: 'Post successfully updated' });
  },
];

exports.publish_post = async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.postId,
    { $set: { published: true } },
    { new: true }
  ).catch((err) => {
    res.status(500).json({ err });
    throw err;
  });
  res.status(200).json({ message: 'Post successfully published' });
};
