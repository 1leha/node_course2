const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const socketIO = require('socket.io');

dotenv.config({ path: './.env' });

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');
const viewRoutes = require('./routes/viewRoutes');
const cron = require('./services/cron');

const app = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// REST
/**
 * POST /users - create new user
 * GET  /users - get users list
 * GET  /users/<userId> - get one user (by id)
 * PUT/PATCH /users/<userId> - update user by id
 * DELETE /users/<userId> - delete user by id
 */

mongoose
  .connect(process.env.MONGO_URL)
  .then((con) => {
    console.log('Mongo DB successfully connected..');
  })
  .catch((err) => {
    console.log(err);

    process.exit(1);
  });

app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static('statics'));

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

app.use('/', viewRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/todos', todoRoutes);
// CONTROLLERS
// app.post('/api/users', createUser);
// app.get('/api/users', getUsersList);
// app.get('/api/users/:id', getUserById);

app.get('/ping', (req, res) => {
  res.status(200).json({
    msg: 'pong!',
  });
});

app.all('*', (req, res) => {
  res.status(404).json({
    msg: 'Oops! Resource not found..',
  });
});

app.use((err, req, res, next) => {
  // This is BAD code. Don't use it here.
  // It will be better to use it in custom AppError class or somwhere else..
  // See /utils/AppError.js
  // const msg = Array.isArray(err.message) ? err.message.join(';') : err.message;

  res.status(err.status || 500).json({
    msg: err.message,
    stack: err.stack,
  });
});

// SERVER
const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
  console.log(`Server up and running on port: ${port}`);

  cron();
});

// SOCKET EXAMPLE ========================================
const io = socketIO(server);

// EXAMPLE 1
// io.on('connection', (socket) => {
//   console.log('Socket user connected..');

//   socket.emit('message', { msg: 'Hello from socket!!' });

//   socket.on('custom event', (data) => {
//     console.log(data);
//   });
// });

// EXAMPLE 2
// io.on('connection', (socket) => {
//   socket.on('message', (msg) => {
//     console.log('Message from client: ', msg);

//     io.emit('message', msg);
//   });
// });

// EXAMPLE 3
const node = io.of('/node');

node.on('connection', (socket) => {
  socket.on('join', (data) => {
    socket.join(data.room);
    node.in(data.room).emit('message', `New user joined ${data.room} room`);
  });

  socket.on('message', (data) => {
    node.in(data.room).emit('message', data.msg);
  });
});

module.exports = server;
