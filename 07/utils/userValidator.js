const Joi = require('joi');

const userRolesEnum = require('../constants/userRolesEnum');

const PASSWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,128})/;

exports.createUserDataValidator = (data) => Joi.object()
  .options({ abortEarly: false })
  .keys({
    name: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
    birthyear: Joi.number().min(1940).max(2023).required(),
    password: Joi.string().regex(PASSWD_REGEX).required(),
    role: Joi.string().valid(...Object.values(userRolesEnum)),
  })
  .validate(data);

exports.updateUserDataValidator = (data) => Joi.object()
  .options({ abortEarly: false })
  .keys({
    name: Joi.string().min(3).max(20),
    email: Joi.string().email(),
    birthyear: Joi.number().min(1940).max(2023),
    role: Joi.string().valid(...Object.values(userRolesEnum)),
  })
  .validate(data);

exports.signupUserDataValidator = (data) => Joi.object()
  .options({ abortEarly: false })
  .keys({
    name: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
    birthyear: Joi.number().min(1940).max(2023).required(),
    password: Joi.string().regex(PASSWD_REGEX).required(),
  })
  .validate(data);
