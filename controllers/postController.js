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
