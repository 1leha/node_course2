const Todo = require('../models/todoModel');
const { catchAsync } = require('../utils');
const { USER } = require('../constants/userRolesEnum');

exports.createTodo = catchAsync(async (req, res) => {
  const newTodoData = {
    owner: req.user,
    title: req.body.title,
    desc: req.body.desc,
    due: req.body.due,
  };

  const newTodo = await Todo.create(newTodoData);

  res.status(201).json({
    todo: newTodo,
  });
});

exports.getTodosList = catchAsync(async (req, res) => {
  const { limit, page, sort, order, search } = req.query;

  // define search options ==================
  const findOptions = search
    ? { $or: [{ title: { $regex: search, $options: 'i' } }, { desc: { $regex: search, $options: 'i' } }] }
    : {};

  if (search && req.user.role === USER) {
    findOptions.$or.forEach((option) => {
      option.owner = req.user;
    });
  }

  if (!search && req.user.role === USER) {
    findOptions.owner = req.user;
  }

  // init datebase query =================
  const todosQuery = Todo.find(findOptions);

  // sorting =======================
  // order = 'ASC' | 'DESC';
  // .sort('-title') | .sort('desc');
  // const todos = await Todo.find().sort(`${order === 'DESC' ? '-' : ''}${sort}`);
  todosQuery.sort(`${order === 'DESC' ? '-' : ''}${sort}`);

  // pagination =========================
  // limit = 5
  // page 1 => skip 0;
  // page 2 => skip 5;
  // page 3 => skip 10;
  const paginationPage = +page || 1;
  const paginationLimit = +limit || 5;
  const skip = (paginationPage - 1) * paginationLimit;
  // const todos = await Todo.find().skip(skip).limit(paginationLimit);

  todosQuery.skip(skip).limit(paginationLimit);

  // const todos = await Todo.find(findOptions);
  const todos = await todosQuery;
  const total = await Todo.count(findOptions);

  res.status(200).json({
    total,
    todos,
  });
});
