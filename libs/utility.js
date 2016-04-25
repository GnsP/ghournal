var tty = require('tty');
var child_process = require('child_process');
var fs = require('fs');

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

module.exports.Today = function() {
  var self = this;
  self.today = new Date();
  self.dd = self.today.getDate();
  self.mm = months[self.today.getMonth()];
  self.yyyy = self.today.getFullYear();

  self.dateString = self.dd+'th '+self.mm+', '+self.yyyy;
}


module.exports.spawnVim = function(file, callback) {
  var vim = child_process.spawn('vim', [file]);
  
  function indata(c) {
    vim.stdin.write(c);
  }

  function outdata(c) {
    process.stdout.write(c);
  }

  process.stdin.resume();
  process.stdin.on('data', indata);
  vim.stdout.on('data', outdata);
  process.stdin.setRawMode(true);

  vim.on('exit', function(code) {
    process.stdin.setRawMode(false);
    process.stdin.pause();
    process.stdin.removeListener('data', indata);
    vim.stdout.removeListener('data', outdata);

    callback(code);
  });
}


