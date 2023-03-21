const { catchAsync } = require('../utils');
const User = require('../models/userModel');

/**
 * Create user controller
 */
exports.createUser = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);

  newUser.password = undefined;

  res.status(201).json({
    user: newUser,
  });
});

/**
 * Get users list controller
 */
exports.getUsersList = catchAsync(async (req, res) => {
  // const users = await User.find().select('name email birthyear');
  // const users = await User.find().select('+password');
  const users = await User.find().select('-__v');

  res.status(200).json({
    users,
  });
});

/**
 * Get one user controller
 */
exports.getUserById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  // EXAMPLE how to use checkPassword user custom method
  // const user = await User.findById(id).select('+password');
  // const passwordIsValid = await user.checkPassword('Pass1234', user.password);

  res.status(200).json({
    user,
  });
});

/**
 * Update user controller
 */
exports.updateUserById = catchAsync(async (req, res) => {
  const { id } = req.params;

  // const updatedUser = await User.findByIdAndUpdate(id, { name: req.body.name });
  const updatedUser = await User.findByIdAndUpdate(id, { name: req.body.name }, { new: true });

  res.status(200).json({
    user: updatedUser,
  });
});

/**
 * Delete user controller
 */
exports.deleteUserById = catchAsync(async (req, res) => {
  const { id } = req.params;

  await User.findByIdAndDelete(id);

  res.sendStatus(204);
});
