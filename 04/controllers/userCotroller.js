const uuid = require('uuid').v4;
const fs = require('fs').promises;

const { catchAsync, AppError } = require('../utils');
const { createUserDataValidator } = require('../utils/userValidator');

exports.createUser = catchAsync(async (req, res, next) => {
  const { error, value } = createUserDataValidator(req.body);

  if (error) return next(new AppError(400, error.details[0].message));

  const { name, year } = value;

  const dataFromDB = await fs.readFile('./models.json');

  const users = JSON.parse(dataFromDB);

  const newUser = {
    name,
    year,
    id: uuid(),
  };

  users.push(newUser);

  await fs.writeFile('./models.json', JSON.stringify(users));

  res.status(201).json({
    user: newUser,
  });
});

exports.getUsersList = catchAsync(async (req, res) => {
  const users = JSON.parse(await fs.readFile('./models.json'));

  res.status(200).json({
    users,
  });
});

exports.getUserById = (req, res) => {
  // const { id } = req.params;

  // const dataFromDB = await fs.readFile('./models.json');

  // const users = JSON.parse(dataFromDB);
  // const user = users.find((item) => item.id === id);

  const { user } = req;

  res.status(200).json({
    user,
  });
};
