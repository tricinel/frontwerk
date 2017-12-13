const inquirer = require('inquirer');
const { warning, info } = require('../utils/logger');

process.on('unhandledRejection', err => {
  throw err;
});

const handleEject = answer => {
  if (!answer.shouldEject) {
    warning('Close one! Eject aborted.');
    return;
  }

  info(
    'Alas, I am still working on this script!',
    'It will be available in a future version of frontwerk!'
  );
};

inquirer
  .prompt({
    type: 'confirm',
    name: 'shouldEject',
    message: 'Are you sure you want to eject? This action is permanent.',
    default: false
  })
  .then(handleEject);
