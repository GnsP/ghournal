//var markdown = require('markdown').markdown;
var markdown = require('marked');
var fs = require('fs');
var pm = require('./printMessage');

markdown.setOptions({
  highlight: function(code, lang) {
    return require('highlightjs').highlightAuto(code).value;
  },
});

module.exports.Parser = function(filepath) {
  var self = this;

  // methods for setting the path to the blogpost file to be parsed
  // filepath can be supplied during construction of the Parser object
  // or it can be se using the setFilepath method.

  self.filepath = filepath;
  self.setFilepath = function(filepath) {
    self.filepath = filepath;
  }

  // Read the blogpost file and return string
  // If read unsuccessful show error message and return false

  self.readFile = function() {
    try {
      var blogpost = fs.readFileSync(self.filepath, 'utf8');
      pm.success('blogpost data read from '+self.filepath);
      return blogpost;
    }
    catch (e) {
      pm.error(self.filepath+' could not be read, check if the file exists and has proper permissions');
      return false;
    }
  }

  // Parse a string in the blogpost format return a JSON Object representing
  // the blogpost. During this parsing the header information is parsed and
  // the content is parsed from markdown to HTML.
  //
  // The format for the blogpost is:
  //
  //    title : <title of the post>
  //    abstract : <short description of the post>
  //    categories : <comma separated list of categories>
  //
  //    -----------------------------------------------------------------------
  //
  //    <content of the post in markdown>
  //
  // the dashed delimiter line is exactly 70 characters long. The blogpost file
  // is supposed to be generated in this format by the ghournal-new command and
  // the details to be filled in by the blogger.

  self.parseString = function(string) {
    var delim = Array(71).join('-');
    var splitString = string.split(delim);
    var header = splitString[0];
    var content = splitString[1];

    var post = self.parseHeaderString(header);
    post.content = self.parseContentString(content);

    return post;
  }


  // Parse the header part of the blogpost string, construct a post oblject,
  // put the header information in the object and return the object

  self.parseHeaderString = function(string) {
    var data = string.trim().split('\n');
    var post = {};
    data.forEach(function(line) {
      var splitLine = line.split(':');
      var key = splitLine[0].trim();
      var val = splitLine[1].trim();
      post[key] = val;
    });
    if(post.categories != '') {
      var cats = post.categories;
      var categories = cats.split(',');
      post.categories = [];
      categories.forEach(function(cat) {
        post.categories.push(cat.trim());
      });
    }
    else post.categories = [];
    return post;
  }

  // parse the post content from markdown to HTML

  self.parseContentString = function(string) {
    markdown.setOptions({ baseUrl: self.baseurl });
    return markdown(string.trim());
  }

  // Read and parse a file in one go.
  // This is gonna be the most used function anyway. :)

  self.parse = function(opts) {
    self.baseurl = opts ? opts.baseurl : '';
    var data = self.readFile();
    if(data)
      return self.parseString(data);
    else return {};
  }
}


