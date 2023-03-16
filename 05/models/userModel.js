const mongoose = require('mongoose');

const userRolesEnum = require('../constants/userRolesEnum');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: [true, 'Duplicated email..'],
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

const User = mongoose.model('User', userSchema);

module.exports = User;
