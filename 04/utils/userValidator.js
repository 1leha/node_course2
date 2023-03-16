const Joi = require('joi');

exports.createUserDataValidator = (data) => Joi.object({
  name: Joi.string().min(3).max(12).required(),
  year: Joi.number().min(1940).max(2023).required(),
}).validate(data);
