var util = require("../util/object-util.js");

var arBookFind = require("./arfinder-handlers.js");
var googleBooks = require("./google-handlers.js");

module.exports = util.mergeObjects(arBookFind, googleBooks);