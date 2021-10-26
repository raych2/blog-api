const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    title: { type: String, maxLength: 100, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, maxLength: 2000, required: true },
    published: { type: Boolean, default: false },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
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

PostSchema.virtual('postDate').get(function () {
  return DateTime.fromJSDate(this.createdAt).toLocaleString(
    DateTime.DATETIME_FULL
  );
});

PostSchema.virtual('url').get(function () {
  return '/posts/' + this._id;
});

module.exports = mongoose.model('Post', PostSchema);
