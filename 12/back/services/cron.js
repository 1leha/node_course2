const cron = require('node-cron');

const Todo = require('../models/todoModel');

module.exports = () => {
  cron.schedule('18 * * * *', async () => {
    console.log('||=============>>>>>>>>>>>');
    console.log('Cron');
    console.log('<<<<<<<<<<<=============||');

    await Todo.deleteMany({ due: { $lte: Date.now() } });
  });
};
