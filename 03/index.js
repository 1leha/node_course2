const express = require('express');
const cors = require('cors');
const uuid = require('uuid').v4;
const fs = require('fs').promises;

const app = express();

app.use(cors());

app.use((req, res, next) => {
  req.time = new Date().toLocaleString('uk-UA');

  next();
});

const port = 3000;

// CRUD - create, read, update, delete
app.get('/users', (req, res) => {
  // console.log(req);

  // res.send('<h1>Hello world!!</h1>');
  res.status(200).json({
    user: {
      name: 'Joe',
      year: 2002,
      time: req.time,
    },
  });
});

app.listen(port, () => {
  console.log(`Server up and running on port: ${port}`);
});
