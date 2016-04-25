#!/usr/bin/env node

var jfh = require('../libs/jsonFileHandler');
var argv = require('commander');
var chalk = require('chalk');

// Read the categories.json file to the categories object
// If the file does not exist in the current directory
// throw an error and exit

var autoHandledFile = jfh.jsonFileBuilder({});
var categories = new autoHandledFile('categories.json');
if(!categories.read()) 
  throw 'The categories file could not be read or parsed in '+process.cwd;

// Read the category names from the command-line arguments 
// and add them as actegories if they do not already exist

argv
  .arguments('<category> [otherCategories...]')
  .action(function(category, otherCategories){
    if(category) {
      if(!categories[category]) categories[category] = [];
      if(otherCategories) {
        otherCategories.forEach(function(cat){
          if(!categories[cat]) categories[cat] = [];
        });
      }
      categories.save();
    }
    else {

      // This is for future reference in case of any BUG arises
      // This block is never reached even when we call the command
      // with 0 arguments. This error should be printed when the 
      // command is called with no arguments, but it does not affect 
      // the workflow anyway. 
      //
      // So, we are leaving it like this, as long as it works.
      // But if any BUG arises, the cause might be rooted at the 
      // question, "why this else block is never reached?" .

      console.log(chalk.black.bgRed('ERROR')+
                  ' at least one category name should be given as argument');
    }
  })
  .parse(process.argv);


