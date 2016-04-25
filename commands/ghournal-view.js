#!/usr/bin/env node

var pm = require('../libs/printMessage');
var jfh = require('../libs/jsonFileHandler');

var fs = require('fs');
var argv = require('commander');
var chalk = require('chalk');
var htmlView = require('html-to-text');

// Read the postID given as the argument and store in postID 
// variable. If postid not given in arguments, make postID false
// to prompt the user to give a valid postID.

var postID = '';
argv
  .arguments('<postid>')
  .action(function(postid) {
    if(typeof postid == 'undefined' || !postid)
      postID = false;
    else postID = postid;
  })
  .parse(process.argv);


// load the posts.json file 
// and read the existing data into the object

var existingData = jfh.jsonFileBuilder({});
var posts = new existingData('posts.json');

var exists = posts.read();

if(!exists) throw('Blog not initialised');

// function to check that the postID given is existing
// check the given postID against all keys present in posts.json

var validatePostID = function(pid) {
  if(pid in posts) {
    return true;
  }
  if(pid == '' || typeof pid == 'undefined' || pid == false) {
    pm.error('PostID can not be empty');
    return false;
  }
  return false;
}


// check if postid is given as argument and is valid. if not display "not found"
// and exit. Once we get the postid determine the path to the draft.blogpost

if(postID == false || !validatePostID(postID)) {
  pm.error(postID+' not found');
  throw postID+" not found";
}

var post = new existingData('./posts/'+postID+'/post.json');
post.read();


// DISPLAY THE POST

if(post.published) {
  console.log();
  console.log(Array(81).join(chalk.bgBlue(' ')));
  console.log();
  console.log(chalk.bold.yellow(post.title));
  console.log(chalk.dim(post.created));
  console.log();
  console.log(chalk.bold.blue('Abstract'));
  console.log(chalk.dim(htmlView.fromString(post.abstract)));
  console.log();
  console.log(Array(81).join(chalk.bgBlue(' ')));
  console.log();
  console.log(chalk.dim(htmlView.fromString(post.content)));
  console.log();
  console.log(Array(81).join(chalk.bgBlue(' ')));
  console.log();
}
else {
  pm.error(postID+' not published yet');
}
