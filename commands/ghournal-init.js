#!/usr/bin/env node

var jfh = require('../libs/jsonFileHandler');
var fs = require('fs');
var chalk = require('chalk');


// JSON file schema for the blog object. The following schema
// specifies the keys in the JSON file that are supplied by
// the user and defines the datatypes and prompts for those keys.
// The actual object is created using this schema.

var blogData = jfh.jsonFileBuilder({
      "name" : {
        "type":"string",
        "defaultValue":"Blog",
        "prompt":"Blog Name "
      },
      "description" : {
        "type":"string",
        "defaultValue":"description not given",
        "prompt":"Short Description of Blog "
      },
      "tagline" : {
        "type":"string",
        "defaultValue":"Built with and managed by ghournal",
        "prompt":"Blog Tagline "
      },
      "url" : {
        "type":"string",
        "defaultValue":"URL not given",
        "prompt":"Blog URL "
      }
    });

// Schema for the Author object and it's JSON file

var authorData = jfh.jsonFileBuilder({
      "name" : {
        "type":"string",
        "defaultValue":"unnamed",
        "prompt":"Author "
      },
      "email" : {
        "type":"string",
        "defaultValue":"Email not given",
        "prompt":"Email "
      },
      "contact" : {
        "type":"string",
        "defaultValue":"Contact not given",
        "prompt":"Contact "
      },
      "homepage" : {
        "type":"string",
        "defaultValue":"Homepage not given",
        "prompt":"Author Homepage URL "
      },
      "displayPic" : {
        "type":"string",
        "defaultValue":"assets/authorDefaultDP.jpg",
        "prompt":"Path to DisplayPic "
      }
    });

// Create the blog and author objects with their corresponding
// files. When we'll do manipulations on the objects and call
// the save method on the objects the data will be written to
// the corresponding JSON file.

var blog = new blogData('blog.json');
var author = new authorData('author.json');


// Read existing data from the files or prompt the user to supply
// the data to be written to the files, in case it's being created
// for the first time.

blog.load();
author.load();


// Add properties that link the blog object to other related JSON files
// like categories, posts and timeline.
// Then save the data to the blog.json file.

blog.authorLink = 'author.json';
blog.postsLink = 'posts.json';
blog.categoriesLink = 'categories.json';
blog.timelineLink = 'timeline.json';
blog.rootDirectory = process.cwd();

blog.save();


// Create the categories.json, posts.json and timeline.json files
// with blank objects containing only self.filepath links, if they
// do not alreadt exist. If they exist then read the data in them.
// Then save the files.

var blankData = jfh.jsonFileBuilder({});
var categories = new blankData('categories.json');
var posts = new blankData('posts.json');
var timeline = new blankData('timeline.json');

categories.read();
posts.read();
timeline.read();

categories.save();
posts.save();
timeline.save();


// Create the posts and assets directories if they do not already exist

try {
  fs.mkdirSync('assets');
  fs.mkdirSync('posts');
  fs.mkdirSync('categories');
} catch (e) {
  // Don't give a fuck if an exception occurs here.
  // Because the excption occurs mostly when the directories are
  // already there.
  // If in any case, the directories do not exist and we still
  // get an exception, Just warn the user to manually create them
  // id necessary.

  console.log(chalk.black.bgYellow('WARNING')+
      ' Either the posts and assets directories already exist '+
      'or the script failed to create them. In any case create them manually '+
      'if needed and give necessary permissions.');
}





