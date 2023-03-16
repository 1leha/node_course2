const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userRolesEnum = require('../constants/userRolesEnum');

const userSchema = new mongoose.Schema({
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
  year: {
    type: Number,
  },
  role: {
    type: String,
    enum: Object.values(userRolesEnum), // ['user', 'admin', 'moderator']
    default: userRolesEnum.USER, // 'user'
  },
});

// Pre save hook
userSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  // const passwordIsValid = await bcrypt.compare('Pass&2234', hashedPassword);

  next();
});

// Custom mmethod
userSchema.methods.checkPassword = (candidate, hash) => bcrypt.compare(candidate, hash);

const User = mongoose.model('User', userSchema);

module.exports = User;
