const Comment = require('../models/Comment');
const Post = require('../models/Post');
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
    const comment = new Comment({
      author: req.body.author,
      text: req.body.text,
      post: req.params.postId,
      timestamps: true,
    });
    const newComment = await comment.save().catch((err) => {
      res.status(500).json({ message: 'Cannot add comment to post' });
      throw err;
    });
    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      { $push: { comments: newComment } },
      { new: true }
    ).catch((err) => {
      res.status(500).json({ err });
      throw err;
    });
    res.status(200).json({ message: 'New comment successfully added' });
  },
];

exports.delete_comment = async (req, res) => {
  const comment = await Comment.findByIdAndDelete(req.params.commentId).catch(
    (err) => {
      res.status(500).json({ err });
      throw err;
    }
  );
  const post = await Post.findByIdAndUpdate(
    req.params.postId,
    { $pull: { comments: req.params.commentId } },
    { new: true }
  ).catch((err) => {
    res.status(500).json({ err });
    throw err;
  });
  res.status(200).json({ message: 'Comment successfully deleted' });
};
