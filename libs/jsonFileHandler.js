var fs = require('fs');
var chalk = require('chalk');
var prompt = require('prompt-sync')();

/**
 *  FORMAT OF THE SCHEMA OBJECT
 *  ---------------------------
 *
 *  Schema = {
 *              key: {
 *                type: _ ,
 *                defaultValue: _ ,
 *                prompt: _ ,
 *                ...
 *                ... userDefinedProperties ...
 *              }
 *              .
 *              .
 *              .
 *           }
 *
 *  SUPPORTED DATA-TYPES FOR THE SCHEMA OBJECT
 *  ------------------------------------------
 *
 *  string
 *  boolean
 *  number
 *
 */


var classSchemaValidator = function(classSchema) {
  var supportedTypes = ['string', 'boolean', 'number'];
  for(var key in classSchema) {
    if(classSchema.hasOwnProperty(key)) {
      if(classSchema[key].type == 'string' || classSchema[key].type == 'number' || classSchema[key].type == 'boolean') {
        if(typeof classSchema[key].defaultValue != classSchema[key].type) throw "Schema Validation Failed";
        if(typeof classSchema[key].prompt != "string") throw "Schema Validation Failed";
      }
      else{
        //console.log(key, classSchema.key.type);
        throw "Schema Validation Failed";
      }
    }
  }
  return true;
}

module.exports.jsonFileBuilder = function(classSchema) {
  classSchemaValidator(classSchema);

  return function(filepath) {
    var self = this;

    self.filepath = filepath;
    self.load = function() {
      var exists = self._read();
      if(!exists){
        console.log(chalk.bold.green('Creating '+self.filepath));
        self.promptForData();
      }
      return exists;
    }

    self._read = function() {
      try {
        var data = JSON.parse(fs.readFileSync(self.filepath, 'utf8'));
        console.log(chalk.green('Read data from existing '+self.filepath));
        for(var key in data)
          if(data.hasOwnProperty(key)) self[key] = data[key];
        return true;
      }
      catch (e) {
        return false;
      }
    }

    self.read = function() {
      var exists = self._read();
      if(!exists) console.log(chalk.black.bgRed('ERROR')+' '+self.filepath+' does not exist, Initialise the blog first');
      else console.log(chalk.black.bgGreen('SUCCESS')+' data read from '+self.filepath);
      return exists;
    }


    self.promptForData = function() {
      for(var key in classSchema)
        if(classSchema.hasOwnProperty(key))
          self[key] = prompt(chalk.bold.yellow(classSchema[key].prompt)+' <'+self[key]+'> ') || self[key];

      if (Object.keys(classSchema).length) self.saveWithConfirmation();
      else self.save();
    }

    self.saveWithConfirmation = function() {
      console.log(JSON.stringify(self, null, 4));
      var confirmation = prompt(chalk.bold.cyan('Looks OK ? (Y/N) '));
      if(confirmation == 'Y' || confirmation == 'y') self.save();
      else return self.promptForData();
    }

    self.save = function() {
      try {
        fs.writeFileSync(self.filepath, JSON.stringify(self, null, 4));
        console.log(chalk.black.bgGreen('SUCCESS')+' data written to '+self.filepath);
        return true;
      }
      catch (e) {
        console.log(chalk.black.bgRed('ERROR')+' could not write data to '+self.filepath);
        return false;
      }
    }

    for(var key in classSchema) {
      if(classSchema.hasOwnProperty(key)) {
        self[key] = classSchema[key].defaultValue;
      }
    }
  }
}


