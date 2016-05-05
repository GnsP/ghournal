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


// load the blog.json, posts.json, categories.json and timeline.json files
// and read the existing data into their objects

var existingData = jfh.jsonFileBuilder({});
var categories = new existingData('categories.json');
var posts = new existingData('posts.json');
var timeline = new existingData('timeline.json');
var blog = new existingData('blog.json');

var exists = categories.read();
exists = exists && posts.read();
exists = exists && timeline.read();
exists = exists && blog.read();

if(!exists) throw "Blog not initialised";

// function to check that the postID given is unique (not existing)
// check the given postID against all keys present in posts.json

var validatePostID = function(pid) {
  if(pid in posts) {
    pm.error(pid+' is not unique. It already exists.');
    return false;
  }
  if(pid == '' || typeof pid == 'undefined' || pid == false) {
    pm.error('PostID can not be empty');
    return false;
  }
  return true;
}

// function to prompt the user to give a valid postID
// if the user gives an invalid postID, prompt them again and again
// until they come up with a valid and unique postID or just give up
// by pressing Ctrl+C.

var promptUserForPostID = function() {
  var pid = prompt(chalk.bold.yellow('PostID :'));
  if(!validatePostID(pid)) return promptUserForPostID();
  else return pid;
}

// check if postid is given as argument and is valid. if not prompt the
// user to supply a valid and unique postid.
if(postID == false || !validatePostID(postID)) postID = promptUserForPostID();



// create a separate directory for the post with the given postID in the 
// posts directory. Create a assets directory in the post diectory and also
// setup a post.json file there.

var postDir = blog.rootDirectory+'/posts/'+postID;
var postAssetsDir = blog.rootDirectory+'/posts/'+postID+'/assets';

try {
  fs.mkdirSync(postDir);
  fs.mkdirSync(postAssetsDir);
}
catch (e) {
  pm.error('Could not create the directories for the post '+postID);
  throw new Error('Failed to create separate directories for the post');
}

var today = new util.Today();

var postDataFile = jfh.jsonFileBuilder({
                                        "title" : {
                                          "type" : "string",
                                          "defaultValue" : today.dateString,
                                          "prompt" : "Title"
                                        },
                                        "abstract" : {
                                          "type" : "string",
                                          "defaultValue" : "Just another post",
                                          "prompt" : "Abstract"
                                        }
                                      });

var post = new postDataFile('./posts/'+postID+'/post.json');
post.load();


// fill in the post properties like created, modified, published (false now)
// etc and populate the posts.json, timeline.json files accordingly.
// Then save those files.

post.created = today.dateString;
post.modified = today.dateString;
post.published = false;
post.categories = [];

posts[postID] = post;

post.save();
posts.save();

if(!timeline[today.yyyy]) timeline[today.yyyy] = {};
if(!timeline[today.yyyy][today.mm]) timeline[today.yyyy][today.mm] = [];
timeline[today.yyyy][today.mm].unshift({"postID":postID, "date":today.dd});
timeline.save();


// Create the draft.blogpost file where the user would be writing and editing
// the blogpost in markdown. Follow the .blogpost format to create the template
// and save the template in the file.

var draftTemplate = "title : "+post.title+
                    "\nabstract : "+post.abstract+
                    '\ncategories : \n\n'+
                    Array(71).join('-')+
                    '\n\n Write the content in markdown here';

try {
  fs.writeFileSync('./posts/'+postID+'/draft.blogpost', draftTemplate);
}
catch (e) {
  pm.error('Could not create draft.blogpost file,'+
            ' follow the blogpost format to create it manually');
}


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

