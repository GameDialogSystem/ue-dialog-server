var fileUtil = require('../libraries/fileUtility.js'),
    xmlUtil = require('../libraries/xmlUtility.js'),
    Promise = require("bluebird"),
    fs = require('fs'),
    path = require('path'),
    resolve = require('path').resolve,
    xml2js = require('xml2js'),
    uuidv4 = require('uuid/v4'),
    uuidv5 = require('uuid/v5'),
    parser = require('./xmlParser.js');

var directory = resolve(__dirname + '/../../files/');

exports.initialize = function(){
  parser.registerElementParser('dialog', require('./dialogParser.js'), false);
  parser.registerElementParser('dialog_line', require('./dialogLineParser.js'), true);
  parser.registerElementParser('line_connection', require('./connectionParser.js'), true);
  parser.registerElementParser('text', require('./textParser.js'), false);
  parser.registerElementParser('condition', require('./conditionParser.js'), false);
}

exports.getDialogs = function(){
  return dialogs;
}

exports.getDialog = function(id){
  return new Promise((resolve, reject) => {
    let dialog = parser.getParsedElement("dialog", id);

    if(dialog !== undefined){
      resolve(dialog);
    }else{
      parser.parseFile(path.join(directory,"foo.xml")).then(dialog => {
        resolve(dialog);
      })
    }
  })
}

exports.readAllDialogs = function(){
  let self = this;

  var files = fs.readdirAsync(directory).map(filename => {
    return fileUtil.readFile(path.join(directory,filename));
  }).then(function(content){
    Promise.map(content, item => {
      return xmlUtil.parseStringFromFile(item);
    }).then(list => {

    });
  });

}

exports.addLineToDialog = function(dialog, dialogLine){

}

exports.removeLineFromDialog = function(dialog, dialogLine){

}

exports.updateDialogLine = function(dialogLine, newDialogLine){

}