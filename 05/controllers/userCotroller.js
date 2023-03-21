const { catchAsync, AppError } = require('../utils');
const { createUserDataValidator } = require('../utils/userValidator');
const User = require('../models/userModel');

exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  newUser.password = undefined;

  res.status(201).json({
    user: newUser,
  });
});

exports.getUsersList = catchAsync(async (req, res) => {
  // const users = await User.find().select('name email birthyear');
  // const users = await User.find().select('+password');
  const users = await User.find().select('-__v');

  res.status(200).json({
    users,
  });
});

exports.getUserById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  res.status(200).json({
    user,
  });
});

exports.updateUserById = catchAsync(async (req, res) => {
  const { id } = req.params;

  // const updatedUser = await User.findByIdAndUpdate(id, { name: req.body.name });
  const updatedUser = await User.findByIdAndUpdate(id, { name: req.body.name }, { new: true });

  res.status(200).json({
    user: updatedUser,
  });
});

exports.deleteUserById = catchAsync(async (req, res) => {
  const { id } = req.params;

  await User.findByIdAndDelete(id);

  res.sendStatus(204);
});
