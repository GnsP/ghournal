#!/usr/bin/env node

var argv = require('commander');
var chalk = require('chalk');
var fs = require('fs');

argv
  .option('--pretty', 'Pretty-print the status')
  .parse(process.argv);

var blogData;
fs.readFile('blog.json', 'utf8', function(err, data){
  if(err) printStatus('Error in reading blog.json, Initialise the blog first');
  else{
    blogData = JSON.parse(data);
    printStatus(blogData);
  }
});


function printStatus(status) {
  if(argv.pretty) console.log(chalk.bold.red('Pretty-print SET'), status);
  else console.log(status);
}
