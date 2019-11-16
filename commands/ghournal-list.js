#!/usr/bin/env node

var jfh = require('../libs/jsonFileHandler');
var pm = require('../libs/printMessage')
var argv = require('commander');
var chalk = require('chalk');

// Read the categories.json and posts.json files to their objects
// If the files do not exist in the current directory
// throw an error and exit

var autoHandledFile = jfh.jsonFileBuilder({});
var categories = new autoHandledFile('categories.json');
var posts = new autoHandledFile('posts.json');

var exists = categories.read();
exists = posts.read() && exists;

//console.log(categories);
//console.log(posts);

if(!exists)
  throw 'Blog not initialised in '+process.cwd();

// Read the category names from the command-line arguments
// and add them to the cats list

var list = {};
var catargs = [];

argv
  .arguments('[categories...]')
  .action(function(cats) {
    catargs = cats;
  })
  .parse(process.argv);


// Read the categories given as arguments to the list array
// read the posts in those categories to the list array
if(catargs.length > 0) {
  catargs.forEach(function(cat) {
    if(categories[cat]) {
      list[cat] = {};
      categories[cat].forEach(function(postid) {
        list[cat][postid] = posts[postid];
      });
    }
    else pm.error('category '+cat+' does not exist');
  });
}
// if no category names given, read all posts to the list array

else {
  list.all = {};
  for(var postid in posts) {
    if(posts.hasOwnProperty(postid) && typeof posts[postid] == 'object') {
      list.all[postid] = posts[postid];
    }
  }
}

// display the list
console.log();
console.log();
for(var cat in list) {
  if(list.hasOwnProperty(cat)) {
    console.log(chalk.bold.underline.red(cat));
    for(var postid in list[cat]) {
      if(list[cat].hasOwnProperty(postid)) {
        console.log('|');
        console.log('+---+'+chalk.bold.blue(postid));
        console.log('|   |');
        console.log('|   +---'+chalk.bold.magenta('Title ')+list[cat][postid].title);
        console.log('|   |');
        console.log('|   +---'+chalk.bold.magenta('Location ')+list[cat][postid].filepath);
        console.log('|   |');
        console.log('|   +---'+chalk.bold.magenta('Abstract ')
                              +displayAbstract(list[cat][postid].abstract));
      }
    }
  }
}

function displayAbstract(text) {
  if (!text) return '';
  var output = '';
  var chunk = text;
  var lim = 55;
  var firstline = true;
  while(chunk.length > 55) {
    while(chunk[lim] != ' ' && lim < chunk.length) lim = lim + 1;
    if(firstline) {
      output = output + chunk.slice(0,lim+1)+'\n';
      firstline = false;
    }
    else output = output + '|                '+chunk.slice(0,lim+1)+'\n';
    chunk = chunk.slice(lim+1, chunk.length);
  }
  if(firstline) output = chunk;
  else output = output + '|                '+chunk;
  return output;
}



