const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config({ path: './.env' });

const userRoutes = require('./routes/userRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// REST
/**
 * POST /users - create new user
 * GET  /users - get users list
 * GET  /users/<userId> - get one user (by id)
 * PUT/PATCH /users/<userId> - update user by id
 * DELETE /users/<userId> - delete user by id
 */

app.use(cors());
app.use(express.json());

// MIDDLEWARES
/**
 * Global midlleware.
 */
app.use((req, res, next) => {
  req.time = new Date().toLocaleString('uk-UA');

  next();
});

/**
 * Check if user exists.
 */
// app.use('/api/users/:id', checkUserId);

app.use('/api/users', userRoutes);
// CONTROLLERS
// app.post('/api/users', createUser);
// app.get('/api/users', getUsersList);
// app.get('/api/users/:id', getUserById);

/**
 * Update user by id.
 */
app.patch('/api/users/:id', (req, res) => {});

/**
 * Delete user by id.
 */
app.delete('/api/users/:id', (req, res) => {
  res.sendStatus(204);
});

app.all('*', (req, res) => {
  res.status(404).json({
    msg: 'Oops! Resource not found..',
  });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    msg: err.message,
  });
});

// SERVER
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server up and running on port: ${port}`);
});
