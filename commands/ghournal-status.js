#!/usr/bin/env node

var chalk = require('chalk');
var jfh = require('../libs/jsonFileHandler');
var pm = require('../libs/printMessage')


// Read the blog.json file into the blog object

var existingData = jfh.jsonFileBuilder({});
var blog = new existingData('blog.json');
var exists = blog.read();

// if called on an uninitiated directory where a blog.json
// file is not present, display error and stop

if(!exists) {
  pm.error('Blog not initialised');
  throw 'Blog not initialised';
}

// display the data stored in blog.json

for(var key in blog) {
  if(key != 'filepath' && typeof blog[key] != 'function') {
    pm.task(key);
    console.log(blog[key]);
    console.log();
  }
}

