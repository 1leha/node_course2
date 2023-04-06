const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userRolesEnum = require('../constants/userRolesEnum');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: [true, 'Duplicated email..'],
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    birthyear: {
      type: Number,
    },
    // avatar: {
    //   type: String,
    //   default: 'default-avatar.jpg',
    // },
    avatar: String,
    role: {
      type: String,
      enum: Object.values(userRolesEnum), // ['user', 'admin', 'moderator']
      default: userRolesEnum.USER, // 'user'
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

// Pre save hook // create save
userSchema.pre('save', async function(next) {
  if (this.isNew) {
    const emailHash = crypto.createHash('md5').update(this.email).digest('hex');

    this.avatar = `https://www.gravatar.com/avatar/${emailHash}.jpg?d=retro`;
  }

  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  // const passwordIsValid = await bcrypt.compare('Pass&2234', hashedPassword);

  next();
});

// Custom methods
userSchema.methods.checkPassword = (candidate, hash) => bcrypt.compare(candidate, hash);

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
