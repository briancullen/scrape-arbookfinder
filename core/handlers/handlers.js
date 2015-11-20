var arBookFind = require("./arfinder-handlers.js");
var googleBooks = require("./google-handlers.js");

module.exports.handlers = [arBookFind.arBookSearch, googleBooks.googleBookSearch];