#!/usr/bin/env node

var argv = require('commander');
var chalk = require('chalk');

// Parse the command line arguments

argv
  .version('1.0.0')
  .command('init','Initialise a blog in current directory')
  .command('new [postID]', 'Create a new blog-post as draft')
  .command('add-category [categoryID]', 'Add a new category')
  .command('list [categoryID]', 'List all posts in a given category')
  .command('view [postID]', 'View a post')
  .command('edit [postID]', 'Edit a post')
  .command('status', 'View status of the blog', {isDefault: true})
  .command('publish [postID]', 'Publish the post')
  .parse(process.argv);

// Print the banner

console.log();
console.log();
console.log(chalk.black.bgWhite("                                                                         "));
console.log(chalk.black.bgWhite("             dP                                                    dP    "));
console.log(chalk.black.bgWhite("             88                                                    88    "));
console.log(chalk.black.bgWhite("    .d8888b. 88d888b. .d8888b. dP    dP 88d888b. 88d888b. .d8888b. 88    "));
console.log(chalk.black.bgWhite("    88'  `88 88'  `88 88'  `88 88    88 88'  `88 88'  `88 88'  `88 88    "));
console.log(chalk.black.bgWhite("    88.  .88 88    88 88.  .88 88.  .88 88       88    88 88.  .88 88    "));
console.log(chalk.black.bgWhite("    `8888P88 dP    dP `88888P' `88888P' dP       dP    dP `88888P8 dP    "));
console.log(chalk.black.bgWhite("         .88                                                             "));
console.log(chalk.black.bgWhite("     d8888P         A COMMAND-LINE BASED BLOG ENGINE FOR STATIC SITES    "));
console.log(chalk.black.bgWhite("                                                                         "));
console.log();
console.log();
