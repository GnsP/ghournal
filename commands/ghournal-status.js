#!/usr/bin/env node

var chalk = require('chalk');
var jfh = require('../libs/jsonFileHandler');
var pm = require('../libs/printMessage')


var existingData = jfh.jsonFileBuilder({});
var blog = new existingData('blog.json');

var exists = blog.read();

if(!exists) {
  pm.error('Blog not initialised');
  throw 'Blog not initialised';
}

for(var key in blog) {
  if(key != 'filepath' && typeof blog[key] != 'function') {
    pm.task(key);
    console.log(blog[key]);
    console.log();
  }
}

