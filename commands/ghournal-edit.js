#!/usr/bin/env node

var pm = require('../libs/printMessage');
var jfh = require('../libs/jsonFileHandler');
var util = require('../libs/utility');

var fs = require('fs');
var argv = require('commander');
var prompt = require('prompt-sync')();
var chalk = require('chalk');

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


// load the posts.json and blog.json files 
// and read the existing data into their objects

var existingData = jfh.jsonFileBuilder({});
var posts = new existingData('posts.json');
var blog = new existingData('blog.json');

var exists = posts.read();
exists = exists && blog.read();

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

// function to prompt the user to give a valid postID
// if the user gives an invalid postID, prompt them again and again
// until they come up with a valid and existing postID or just give up
// by pressing Ctrl+C.

var promptUserForPostID = function() {
  var pid = prompt(chalk.bold.yellow('PostID :'));
  if(!validatePostID(pid)) return promptUserForPostID();
  else return pid;
}

// check if postid is given as argument and is valid. if not prompt the
// user to supply a valid and existing postid.
// Once we get the postid determine the path to the draft.blogpost
// Also rewrite the modified property of the post.json file

if(postID == false || !validatePostID(postID)) postID = promptUserForPostID();
var postDir = blog.rootDirectory+'/posts/'+postID;

var today = new util.Today();
var post = new existingData('./posts/'+postID+'/post.json');
post.read();
post.modified = today.dateString;
post.save();


// Spawn a child_process and open the draft.blogpost in vim on that process
// When the user closes vim after editing the blogpost display the path to
// the draft.blogpost file for future reference, so that the user can manually
// edit it if he/she wishes. Though the recommended way of editing a blogpost
// is to do so with the 'ghournal edit <postID>' command.

util.spawnVim('./posts/'+postID+'/draft.blogpost', function(code) {
  if(code == 0) pm.success('Draft edited');
  else pm.error('vim exited with error code '+code);

  pm.message('\n\nPath to the draft post: '+postDir+'/draft.blogpost\n\n');
});

