const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: { type: String, maxLength: 50, required: true },
    password: { type: String, minLength: 6, required: true },
  },
  {
    toJSON: {
      virtuals: true,
      transform: function (doc, ret, options) {
        delete ret.password;
        delete ret.id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

UserSchema.pre('save', async function (next) {
  const user = this;
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
