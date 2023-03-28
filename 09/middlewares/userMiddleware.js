const { Types } = require('mongoose');

const { AppError, catchAsync, userValidator } = require('../utils');
const User = require('../models/userModel');
const ImageService = require('../services/imageService');

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

  if (error) {
    return next(
      new AppError(
        400,
        error.details.map((item) => item.message)
      )
    );
  }

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

// const mutlerStorage = multer.diskStorage({
//   destination: (req, file, callbackFn) => {
//     callbackFn(null, 'statics/img/users');
//   },
//   filename: (req, file, callbackFn) => {
//     const ext = file.mimetype.split('/')[1]; // jpeg, png, gif....

//     callbackFn(null, `${req.user.id}-${uuid()}.${ext}`);
//   },
// });

// const multerFilter = (req, file, callbackFn) => {
//   // 'image/cdhjsakcbjsda' 'document/dbhsajvds'

//   if (file.mimetype.startsWith('image/')) {
//     callbackFn(null, true);
//   } else {
//     callbackFn(new AppError(400, 'Upload images only..'), false);
//   }
// };

// exports.uploadUserPhoto = multer({
//   storage: mutlerStorage,
//   fileFilter: multerFilter,
//   limits: {
//     fileSize: 2 * 1024 * 1024,
//   },
// }).single('avatar');

exports.uploadUserPhoto = ImageService.upload('avatar');

exports.checkPassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('password');

  if (!(await user.checkPassword(currentPassword, user.password))) {
    return next(new AppError(401, 'Current password is wrong..'));
  }

  user.password = newPassword;

  await user.save();

  next();
});
