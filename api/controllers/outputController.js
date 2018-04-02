let xmlParser = require('../libraries/parser/xmlParser.js'),
    emberDataParser = require("../libraries/parser/emberDataParser.js"),
    pluralize = require('pluralize')

exports.createOuput = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  if(pluralize.isPlural(req.body.data.type)){
    req.body.data.type = pluralize.singular(req.body.data.type);
  }

  let dialogLine = xmlParser.getParsedElement("dialog_line", req.body.data.relationships['belongs-to'].data.id);
  if(dialogLine.data.relationships === undefined){
    dialogLine.data.relationships = {}
    dialogLine.data.relationships.outputs = [];
    dialogLine.data.relationships.outputs.push(req.body);
  }
  xmlParser.addParsedElement("output", req.body);

  res.json(req.body);
};
/**
* dummy function to create an input model
*/
exports.getOutput = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  let output = xmlParser.getParsedElement("output", req.params.outputId);
  const data = output.data;



  let object = {
    "output": {
      "id": data.id,
      "belongs-to": data.relationships.connection.data.id
    }
  }




  const relationships = data.relationships;
  if(relationships){
    data.relationships.connection = emberDataParser.createEmberObject("connection", relationships.connection.data.id);
  }

  console.log(data.relationships["belongs-to"]);

  res.json(output);
};

/**
* dummy function to inform ember that the input was successfully deleted from the
* model
*/
exports.deleteOutput = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  res.json({ data : {id: req.params.outputId, x: 0, y: 0, type: 'output'} });
};

exports.createID = function(id, index){
  return "line" + id + "output" + index;
};

exports.createOutputJSONAPI = function(id, dialogLineID, connectedInputID){
  var object = {
    "id" : id,
    "type" : "output",

    "relationships" : {
      "belongs-to" : {
        "data" : {
          "id" : dialogLineID,
          "type" : "dialog-line"
        }
      },
    }
  }

  if(connectedInputID !== undefined){
    object.relationships.input = {
      "data" : {
        "id" : connectedInputID,
        "type": "input"
      }
    }
  }

  return object;
}
