const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const { catchAsync, AppError, userNamesHandler } = require('../utils');
const userRolesEnum = require('../constants/userRolesEnum');
const User = require('../models/userModel');
const Email = require('../services/emailService');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = catchAsync(async (req, res) => {
  const { name, email, birthyear, password } = req.body;

  const newUserData = {
    name: userNamesHandler(name),
    email,
    birthyear,
    password,
    role: userRolesEnum.USER,
  };

  const newUser = await User.create(newUserData);

  newUser.password = undefined;

  const token = signToken(newUser.id);

  try {
    await new Email(newUser, 'localhost:3000/').sendHello();
  } catch (err) {
    console.log(err);
  }

  res.status(201).json({
    user: newUser,
    token,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!password) return next(new AppError(401, 'Not authorized'));

  const user = await User.findOne({ email }).select('+password');

  if (!user) return next(new AppError(401, 'Not authorized'));

  const passwordIsValid = await user.checkPassword(password, user.password);

  if (!passwordIsValid) return next(new AppError(401, 'Not authorized'));

  user.password = undefined;

  const token = signToken(user.id);

  res.status(200).json({
    user,
    token,
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json({
      msg: 'Password reset instruction sent to email',
    });
  }

  const otp = user.createPasswordResetToken();

  await user.save();

  // const emailTransport = nodemailer.createTransport({
  //   service: 'Gmail',
  //   auth: {
  //     user: process.env.EMAIL_USER,
  //     pass: process.env.EMAIL_PASSWORD,
  //   },
  // });
  // const emailTransport = nodemailer.createTransport({
  //   host: 'sandbox.smtp.mailtrap.io',
  //   port: 2525,
  //   auth: {
  //     user: process.env.EMAIL_USER,
  //     pass: process.env.EMAIL_PASSWORD,
  //   },
  // });

  // const emailConfig = {
  //   from: 'Todos App admin <admin@example.com>',
  //   to: user.email,
  //   subject: 'Password reset instruction',
  //   text: resetUrl,
  // };

  // await emailTransport.sendMail(emailConfig);

  try {
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password/${otp}`;

    // send to the email
    console.log('||=============>>>>>>>>>>>');
    console.log(resetUrl);
    console.log('<<<<<<<<<<<=============||');

    await new Email(user, resetUrl).sendRestorePassword();
  } catch (err) {
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;

    await user.save();
  }

  // res.sendStatus(200);
  res.status(200).json({
    msg: 'Password reset instruction sent to email',
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.otp).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError(400, 'Token is invalid'));

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  user.password = undefined;

  res.status(200).json({
    user,
  });
});
