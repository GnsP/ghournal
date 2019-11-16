#!/usr/bin/env node

var pm = require('../libs/printMessage');
var jfh = require('../libs/jsonFileHandler');
var util = require('../libs/utility');
var blogpostParser = require('../libs/blogpostParser');
var renderer = require('../libs/viewDriver');

var fs = require('fs');
var argv = require('commander');
var prompt = require('prompt-sync')();
var chalk = require('chalk');

// Read the postID given as the argument and store in postID
// variable. If postid not given in arguments, make postID false
// to prompt the user to give a valid postID.

var filename = '';
argv
  .arguments('<filename>')
  .action(function(fname) {
    if(typeof fname == 'undefined' || !fname)
      filename = false;
    else filename = fname;
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

// Read the file and parse it.

var parser = new blogpostParser.Parser(filename);
var postString = parser.readFile();
var post = parser.parse();
var postID = '';

// Generate a postID for the post. It must be unique, i.e. not same
// as an existing postID.

var generatePostID = function() {
  if (!post.title) {
    pm.error('Title can not be empty');
    return false;
  }
  while (!postID || postID in posts) {
    postID = util.sluggify(post.title) + '-' + util.randomString(6);
  }
  return true;
}

generatePostID();



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

var today = new util.Today(post.date);
var postfile = new existingData('./posts/'+postID+'/post.json');
postfile.load();
postfile.id = postID;
postfile.title = post.title;
postfile.href = postfile.filepath.replace('./', blog.baseurl+'/').replace('post.json', 'index.html');
var cvr_img = (post.cover_image ? blog.baseurl+'/posts/'+postID+'/assets/'+post.cover_image : false);
postfile.cover_image = cvr_img;

// fill in the post properties like created, modified, published (false now)
// etc and populate the posts.json, timeline.json files accordingly.
// Then save those files.

postfile.created = today.dateString;
postfile.modified = today.dateString;
postfile.published = post.published === 'true';

// function to find if a value is already in an array
function find(arr, val) {
  for(var i=0; i<arr.length; i++)
    if(arr[i]==val) return true;
  return false;
}

// Do not add a category if that has not been added by the user using 'ghournal
// add-category' previously.

postfile.categories = [];
post.categories.forEach(function(cat) {
  if(categories[cat]) {
    if(!find(categories[cat], postID)) categories[cat].unshift(postID);
    if(!find(postfile.categories, cat)) postfile.categories.push(cat);
  }
  else pm.error('category '+cat+' does not exist.'+
    ' Add it with "ghournal add-category '+cat+'" first');
});

posts[postID] = postfile;
posts.save();
categories.save();


var parsedContent = parser.parse({ baseurl: postfile.href.replace('index.html', '')});
postfile.content = parsedContent.content;
postfile.abstract = util.shortenHTML(parsedContent.content);
postfile.save();

if(!timeline[today.yyyy]) timeline[today.yyyy] = {};
if(!timeline[today.yyyy][today.mm]) timeline[today.yyyy][today.mm] = [];
timeline[today.yyyy][today.mm].unshift({"postID":postID, "date":today.dd});
timeline.save();


// Create the draft.blogpost file where the user would be writing and editing
// the blogpost in markdown. Follow the .blogpost format to create the template
// and save the template in the file.

try {
  fs.writeFileSync('./posts/'+postID+'/draft.blogpost', postString);
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

// update the html files

console.log(postfile.categories);

try {
  fs.writeFileSync('./index.html', renderer.renderBlog(blog, timeline, posts, categories));
  console.log(chalk.black.bgGreen('SUCCESS')+' data written to index.html');
} catch (e) {
  console.log(e);
  console.log(chalk.black.bgRed('ERROR')+' could not write data to index.html');
}

try {
  fs.writeFileSync('./posts/'+postID+'/index.html', renderer.renderPost(blog, postfile, posts, categories));
  console.log(chalk.black.bgGreen('SUCCESS')+' data written to posts/'+postID+'/index.html');
} catch (e) {
  console.log(e);
  console.log(chalk.black.bgRed('ERROR')+' could not write data to posts/'+postID+'/index.html');
}

postfile.categories.forEach(function (category) {
  try {
    fs.writeFileSync('./categories/'+category+'.html', renderer.renderCategory(blog, category, posts, categories));
    console.log(chalk.black.bgGreen('SUCCESS')+' data written to categories/'+category+'.html');
  } catch (e) {
    console.log(e);
    console.log(chalk.black.bgRed('ERROR')+' could not write data to categories/'+category+'.html');
  }
});

