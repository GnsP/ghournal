var chalk = require('chalk');

module.exports.error = function(message) {
  console.log(chalk.black.bgRed('ERROR')+' '+message);
}

module.exports.warning = function(message) {
  console.log(chalk.black.bgYellow('WARNING')+' '+message);
}

module.exports.success = function(message) {
  console.log(chalk.black.bgGreen('SUCCESS')+' '+message);
}

module.exports.task = function(message) {
  console.log(chalk.bold.yellow(message));
}

module.exports.message = function(message) {
  console.log(chalk.magenta(message));
}

//module.exports.message('hello');
