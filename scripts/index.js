const { argv } = require('yargs');

const main = () => {
  const { _ } = argv;

  const command = require(`./${_}`);

  if (typeof command === 'function') {
    return command();
  }
  return process.exit(1);
};

main();

