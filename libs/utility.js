var tty = require('tty');
var child_process = require('child_process');
var fs = require('fs');

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
module.exports.months = months;

module.exports.Today = function(d) {
  var self = this;
  self.today = d ? new Date(d) : new Date();
  self.dd = self.today.getDate();
  self.mm = months[self.today.getMonth()];
  self.yyyy = self.today.getFullYear();

  self.dateString = self.mm+' '+self.dd+', '+self.yyyy;
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

module.exports.sluggify = function (s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/(-)+/g, '-').replace(/(^-|-$)/g, '');
}

function randint (l, u) {
  return Math.floor(Math.random()*(u-l + 1)) + l;
}
module.exports.randint = randint;

module.exports.randomString = function (n) {
  var alpha = 'abcdefghijklmnopqrstuvwxyz';
  alpha += alpha.toUpperCase();
  alpha += '0123456789';

  var s = '';
  for (var i=0; i<n; i++) s += alpha[randint(0, alpha.length - 1)];
  return s;
}

function shortenHTML (_html, _maxChar) {
	var maxChar = _maxChar === undefined ? 250 : _maxChar;
  var html = _html.replace(/\n/g, '<br>').replace(/<br>/g,'@@@@').replace(/<\/p>/g, '</p>@@@@@@@@');
  var count = 0;
  var m = 0;
  var inTag = false;

  var str = '';

  for (var i=0; i<html.length; i++) {
    var c = html[i];
    if (c == '<') inTag = true;
    else if (c == '>') inTag = false;
    else {
      if (!inTag) {
        if (c == '@') {
          count += 10;
          m++;
          if (m%4 == 0) str = str + '<br/>';
        }
        else {
          count++;
          str = str + c;
        }
      }
    }
    if (count >= maxChar) break;
  }
  return (str + '<span class="ellipsis">...</span>').replace(/@@@@/g, '<br/>');
}

module.exports.shortenHTML = shortenHTML;
