const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    author: { type: String, maxLength: 30, required: true },
    text: { type: String, maxLength: 500, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret, options) {
        delete ret.id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

CommentSchema.virtual('commentDate').get(function () {
  return DateTime.fromJSDate(this.createdAt).toLocaleString(
    DateTime.DATETIME_FULL
  );
});

module.exports = mongoose.model('Comment', CommentSchema);
