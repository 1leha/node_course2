// console.log(global);

// console.log(__dirname);
// console.log(__filename);

// console.log(process.argv);
// console.log(process.env);
// console.log(process.cwd());
// console.log(process.exit());

// C:\Docume
// /fdsjfsad/fdskafndsa

const { program } = require('commander');
program
  .option('-a, --action <type>', 'choose action')
  .option('-i, --id <type>', 'user id')
  .option('-n, --name <type>', 'user name')
  .option('-e, --email <type>', 'user email')
  .option('-p, --phone <type>', 'user phone');

program.parse(process.argv);

function callAction({ action, id, name, email, phone }) {
  console.log(action, id, name, email, phone);
}
callAction(program.opts());
