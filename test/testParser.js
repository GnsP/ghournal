var parser = require('../blogpostParser');

var myParser = new parser.Parser('./test.blogpost');
console.log(myParser.parse());
