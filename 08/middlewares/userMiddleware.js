const { Types } = require('mongoose');

const { AppError, catchAsync, userValidator } = require('../utils');
const User = require('../models/userModel');

/**
 * Check user id middleware
 */
exports.checkUserId = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const idIsValid = Types.ObjectId.isValid(id);

  if (!idIsValid) return next(new AppError(404, 'User does not exist'));

  const userExists = await User.exists({ _id: id });

  if (!userExists) {
    return next(new AppError(404, 'User does not exist'));
  }

  next();
});

/**
 * Check create new user data middleware
 */
exports.checkCreateUserData = catchAsync(async (req, res, next) => {
  const { error, value } = userValidator.createUserDataValidator(req.body);

  if (error) return next(new AppError(400, error.details.map((item) => item.message)));

  // const userExists = await User.findOne({ email: value.email }).select('_id');
  const userExists = await User.exists({ email: value.email });

  if (userExists) return next(new AppError(409, 'User with this email already exists..'));

  req.body = value;

  next();
});

/**
 * Check update user data middleware
 */
exports.checkUpdateUserData = catchAsync(async (req, res, next) => {
  const { error, value } = userValidator.updateUserDataValidator(req.body);

  if (error) return next(new AppError(400, 'Invalid user data..'));

  const userExists = await User.exists({ email: value.email });

  if (userExists) return next(new AppError(409, 'User with this email already exists..'));

  req.body = value;

  next();
});
