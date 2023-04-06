const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const { catchAsync, userValidator, AppError } = require('../utils');

/**
 * Check create new user data middleware
 */
exports.checkSignupUserData = catchAsync(async (req, res, next) => {
  const { error, value } = userValidator.signupUserDataValidator(req.body);

  if (error) return next(new AppError(400, error.details.map((item) => item.message)));

  // const userExists = await User.findOne({ email: value.email }).select('_id');
  const userExists = await User.exists({ email: value.email });

  if (userExists) return next(new AppError(409, 'User with this email already exists..'));

  req.body = value;

  next();
});

exports.protect = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization?.startsWith('Bearer') && req.headers.authorization.split(' ')[1];

  if (!token) return next(new AppError(401, 'Not logged in..'));

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.log(err.message);

    return next(new AppError(401, 'Not logged in..'));
  }

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) return next(new AppError(401, 'Not logged in..'));

  req.user = currentUser;

  next();
});

/**
 * allowFor('admin', 'user')
 * Use only after 'protect', middleware
 */
exports.allowFor = (...roles) =>
  (req, res, next) => {
    if (roles.includes(req.user.role)) return next();

    next(new AppError(403, 'You are not allowed to view this resource..'));
  };
