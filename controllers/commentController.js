const Comment = require('../models/comment');
const Post = require('../models/post');
const { body, validationResult } = require('express-validator');

exports.add_comment = [
  body('author', 'Author must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('text', 'Text must not be empty.').trim().isLength({ min: 1 }).escape(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ comment: req.body, errors: errors.array() });
    }
    const comment = await Comment.create({
      author: req.body.author,
      text: req.body.text,
      post: req.params.postId,
      timestamps: true,
    }).catch((err) => {
      res.status(500).json({ message: 'Cannot add comment to post' });
      throw err;
    });
    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      { $push: { comments: comment } },
      { new: true }
    ).catch((err) => {
      res.status(500).json({ err });
      throw err;
    });
    res.status(200).json({ message: 'New comment successfully added' });
  },
];

exports.delete_comment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.commentId);
    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      { $pull: { comments: req.params.commentId } },
      { new: true }
    );
  } catch (err) {
    res.status(500).json({ err });
    throw err;
  }
  res.status(200).json({ message: 'Comment successfully deleted' });
};
