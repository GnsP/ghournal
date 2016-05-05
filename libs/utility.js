var tty = require('tty');
var child_process = require('child_process');
var fs = require('fs');

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function dateOrdinal(dd) {
  var d0 = dd%10;
  var d1 = Math.floor(dd/10);

  if(d1 != 1) {
    if(d0==1) return dd + 'st';
    if(d0==2) return dd + 'nd';
    if(d0==3) return dd + 'rd';
    return dd + 'th';
  }
  else return dd + 'th';
}

module.exports.Today = function() {
  var self = this;
  self.today = new Date();
  self.dd = self.today.getDate();
  self.mm = months[self.today.getMonth()];
  self.yyyy = self.today.getFullYear();

  self.dateString = dateOrdinal(self.dd)+' '+self.mm+', '+self.yyyy;
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


