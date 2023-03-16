const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

console.log('||=============>>>>>>>>>>>');
console.log(argv);
console.log('<<<<<<<<<<<=============||');

const invoke = ({id, name}) => {
  console.log(id, name);
  
}

invoke(argv);

