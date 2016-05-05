#!/usr/bin/env node

var pm = require('../libs/printMessage');
var jfh = require('../libs/jsonFileHandler');
var util = require('../libs/utility');
var blogpostParser = require('../libs/blogpostParser');

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
var categories = new existingData('categories.json');

var exists = posts.read();
exists = exists && blog.read();
exists = exists && categories.read();

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

if(postID == false || !validatePostID(postID)) postID = promptUserForPostID();
var postDir = blog.rootDirectory+'/posts/'+postID;

var today = new util.Today();
var post = new existingData('./posts/'+postID+'/post.json');
post.read();


// Parse the draft.blogpost and generate the content and header information
// Store that in post.json. Mark post.json as published and modify the post
// entry in the posts.json

var parser = new blogpostParser.Parser('./posts/'+postID+'/draft.blogpost');
var parsedContent = parser.parse();

for(var key in parsedContent) {
  if(parsedContent.hasOwnProperty(key)) {
    post[key] = parsedContent[key];
  }
}


// function to find if a value is alreadt in an array
function find(arr, val) {
  for(var i=0; i<arr.length; i++)
    if(arr[i]==val) return true;
  return false;
}


// Do not add a category if that has not been added by the user using 'ghournal
// add-category' previously.

post.categories = [];
parsedContent.categories.forEach(function(cat) {
  if(categories[cat]) {
    if(!find(categories[cat], postID)) categories[cat].unshift(postID);
    if(!find(post.categories, cat)) post.categories.push(cat);
  }
  else pm.error('category '+cat+' does not exist.'+
    ' Add it with "ghournal add-category '+cat+'" first');
});

post.published = true;

posts[postID].published = true;
posts[postID].categories = post.categories;
posts[postID].title = post.title;
posts[postID].abstract = post.abstract;


post.save();
categories.save();
posts.save();
