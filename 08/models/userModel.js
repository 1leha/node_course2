const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
    role: {
      type: String,
      enum: Object.values(userRolesEnum), // ['user', 'admin', 'moderator']
      default: userRolesEnum.USER, // 'user'
    },
  },
  {
    timestamps: true,
  }
);

// Pre save hook // create save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  // const passwordIsValid = await bcrypt.compare('Pass&2234', hashedPassword);

  next();
});

// Custom method
userSchema.methods.checkPassword = (candidate, hash) => bcrypt.compare(candidate, hash);

const User = mongoose.model('User', userSchema);

module.exports = User;
