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
      post: req.params.id,
      timestamps: true,
    });
    const newComment = await comment.save().catch((err) => {
      res.status(500).json({ message: 'Cannot add comment to post' });
      throw err;
    });
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: newComment } },
      { new: true }
    ).catch((err) => {
      res.status(500).json({ err });
      throw err;
    });
    res.status(200).json({ message: 'New comment successfully added' });
  },
];
